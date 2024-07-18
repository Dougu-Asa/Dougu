// This file is a class that handles the access, retrieval, and storage of data to AWS Datastore
async function createOrg() {
  var randomstring = require("randomstring");
  try {
    setIsLoading(true);
    const user = await Auth.currentAuthenticatedUser();
    if (user == null) {
      throw new Error("User is not authenticated.");
    }
    const code = randomstring.generate({
      length: 7,
      capitalization: "uppercase",
    });
    console.log("Org Code: " + code);
    // Check that access code and name are unique
    const orgs = await DataStore.query(Organization, (c) =>
      c.or((c) => [c.accessCode.eq(code), c.name.eq(name)]),
    );
    console.log("orgs: ", orgs);
    if (orgs && orgs.length > 0) {
      throw new Error("Organization name or access code is not unique.");
    }
    // query for the user that is the org manager
    const DBuser = await DataStore.query(User, user.attributes.sub);
    if (DBuser == null) throw new Error("User not found in database.");
    // Add the org to the database
    const newOrg = await DataStore.save(
      new Organization({
        name: name,
        accessCode: code,
        manager: DBuser,
      }),
    );
    if (newOrg == null)
      throw new Error("Organization not created successfully.");
    // Add the OrgUserStorage to the DB
    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: newOrg,
        type: UserOrStorage.USER,
        user: DBuser,
        name: DBuser.name,
      }),
    );
    // query current org to be saved in async storage
    const currOrg = await DataStore.query(Organization, newOrg.id);
    // use a key to keep track of currentOrg per user
    const key = user.attributes.sub + " currOrg";
    await AsyncStorage.setItem(key, JSON.stringify(currOrg));
    onChangeName("");
    setIsLoading(false);
    navigation.navigate("Access Code", { accessCode: code });
  } catch (e) {
    setIsLoading(false);
    // setup popups
    console.log(e);
    Alert.alert("Create Org Error!", e.message, [{ text: "OK" }]);
  }
}

// Function to check whether user is already part of an organization and then set navigation and state accordingly
async function checkUserOrg() {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log("Drawer user: ", user.attributes);
    setUsername(user.attributes.name);
    // check if there was a previous org session
    const key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
      c.user.userId.eq(user.attributes.sub),
    );
    if (org == null) {
      // check if the user is part of an org from a previous device
      if (orgUserStorages.length <= 0) {
        setHasOrg(false);
        navigation.navigate("JoinOrCreate");
        return;
      }
      setHasOrg(true);
      navigation.navigate("MyOrgs");
    } else {
      setHasOrg(true);
      navigation.navigate("MemberTabs", { currOrg: orgJSON });
    }
  } catch (error) {
    console.log("error getting user: ", error);
    Alert.alert("Drawer Error", error.message, [{ text: "OK" }]);
    navigation.navigate("Home");
  }
}

// Function to join an Organization
async function joinOrg() {
  try {
    // Query for the org with the access code
    setIsLoading(true);
    const org = await DataStore.query(Organization, (c) =>
      c.accessCode.eq(code.toUpperCase()),
    );
    if (org.length <= 0) {
      throw new Error("Organization does not exist!");
    } else if (org.length > 1) {
      throw new Error("Multiple organizations with the same code!");
    }
    // if the user is already part of that org, throw an error
    const user = await Auth.currentAuthenticatedUser();
    const exist = await DataStore.query(OrgUserStorage, (c) =>
      c.and((c) => [
        c.organization.id.eq(org[0].id),
        c.user.userId.eq(user.attributes.sub),
      ]),
    );
    if (exist.length > 0) {
      throw new Error("User is already part of this organization!");
    }
    // If the org exists, create an OrgUserStorage object
    const DBuser = await DataStore.query(User, user.attributes.sub);
    if (DBuser == null) throw new Error("User does not exist!");
    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: org[0],
        type: UserOrStorage.USER,
        user: DBuser,
        name: DBuser.name,
      }),
    );
    // get the current org after being updated
    const currOrg = await DataStore.query(Organization, (c) =>
      c.id.eq(org[0].id),
    );
    // add our OrgUserStorage to the user and organization
    // save the currOrg and newOrgUserStorage to async storage
    const key = user.attributes.sub + " currOrg";
    await AsyncStorage.setItem(key, JSON.stringify(currOrg));
    setIsLoading(false);
    navigation.navigate("DrawerNav", { screen: "MyOrgs" });
  } catch (e) {
    setIsLoading(false);
    console.log(e);
    Alert.alert("Join Org Error!", e.message, [{ text: "OK" }]);
  }
}

// From MyOrgs Screen
async function subscribeToChanges() {
  DataStore.observeQuery(OrgUserStorage).subscribe((snapshot) => {
    const { items, isSynced } = snapshot;
    console.log(
      `OrgUserStorage [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
    );
    getOrgs();
  });
}

async function getOrgs() {
  const user = await Auth.currentAuthenticatedUser();
  let orgs = await DataStore.query(Organization, (c) =>
    c.UserOrStorages.user.userId.eq(user.attributes.sub),
  );
  const orgData = orgs.map((org, index) => ({
    label: org["name"],
    value: index,
  }));
  setOrgNames(orgData);
}

const setAndNavigate = async (orgName) => {
  const user = await Auth.currentAuthenticatedUser();
  const org = await DataStore.query(Organization, (c) => c.name.eq(orgName));
  // save into our current async storage
  const key = user.attributes.sub + " currOrg";
  await AsyncStorage.setItem(key, JSON.stringify(org[0]));
  console.log(key);
  navigation.navigate("MemberTabs");
};

// From CreateEquipment
async function handleCreate() {
  try {
    let quantityCt = parseInt(quantity);
    // check that quantity > 1
    if (quantityCt < 1 || isNaN(quantityCt)) {
      throw new Error("Quantity must be a number or greater than 0.");
    }
    // check that selected user isn't null
    if (assignUser == null) {
      throw new Error("User must be selected.");
    }
    // check that name isn't empty
    if (name == "") {
      throw new Error("Name must not be empty.");
    }
    setIsLoading(true);
    // create the equipment
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    const dataOrg = await DataStore.query(Organization, orgJSON.id);
    const orgUserStorage = await DataStore.query(OrgUserStorage, assignUser.id);
    if (dataOrg == null || orgUserStorage == null) {
      throw new Error("Organization or User not found.");
    }
    // create however many equipment specified by quantity
    for (let i = 0; i < quantityCt; i++) {
      const newEquipment = await DataStore.save(
        new Equipment({
          name: name,
          organization: dataOrg,
          lastUpdatedDate: new Date().toISOString(),
          assignedTo: orgUserStorage,
          details: details,
        }),
      );
    }
    setIsLoading(false);
    Alert.alert("Equipment created successfully!");
  } catch (error) {
    Alert.alert("Create Equipment Error", error.message, [{ text: "OK" }]);
  }
}

// From CreateStorage
async function handleCreate() {
  try {
    // check that name isn't empty
    if (name == "") {
      throw new Error("Name must not be empty.");
    }
    setIsLoading(true);
    // create the storage
    const user = await Auth.currentAuthenticatedUser();
    let key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    const dataOrg = await DataStore.query(Organization, orgJSON.id);
    if (dataOrg == null) throw new Error("Organization not found.");
    const storage = await DataStore.save(
      new OrgUserStorage({
        name: name,
        organization: dataOrg,
        type: UserOrStorage.STORAGE,
        details: details,
      }),
    );
    setIsLoading(false);
    Alert.alert("Storage Created Successfully!");
  } catch (error) {
    setIsLoading(false);
    Alert.alert("Create Storage Error!", error.toString());
  }
}

// from Equipment.js

async function subscribeToChanges() {
  DataStore.observeQuery(Equipment).subscribe((snapshot) => {
    const { items, isSynced } = snapshot;
    console.log(
      `myEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
    );
    getEquipment();
  });
}

async function getEquipment() {
  const user = await Auth.currentAuthenticatedUser();
  const key = user.attributes.sub + " currOrg";
  const org = await AsyncStorage.getItem(key);
  if (org == null) {
    return;
  }
  const orgJSON = JSON.parse(org);
  const orgUserStorage = await DataStore.query(OrgUserStorage, (c) =>
    c.and((c) => [
      c.organization.id.eq(orgJSON.id),
      c.user.userId.eq(user.attributes.sub),
      c.type.eq(UserOrStorage.USER),
    ]),
  );
  const equipment = await DataStore.query(Equipment, (c) =>
    c.assignedTo.id.eq(orgUserStorage[0].id),
  );
  const equipmentData = processEquipmentData(equipment);
  const groupedEquipment = chunkedEquipment(equipmentData, 3);
  setEquipment(groupedEquipment);
}

// get duplicates and merge their counts
function processEquipmentData(equipment) {
  const equipmentMap = new Map();

  equipment.forEach((equip) => {
    if (equipmentMap.has(equip.name)) {
      const existingEquip = equipmentMap.get(equip.name);
      existingEquip.count += 1; // Increment the count
      existingEquip.data.push(equip.id); // Add the equipment to the data array
      equipmentMap.set(equip.name, existingEquip); // Update the Map
    } else {
      equipmentMap.set(equip.name, {
        id: equip.id,
        label: equip.name,
        count: 1,
        data: [equip.id],
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
}

// Function to chunk the equipment array into subarrays of 2 items each
const chunkedEquipment = (equipment, size) =>
  equipment.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, equipment.slice(i, i + size)]),
    [],
  );

// From InfoScreen.js
async function getOrgInfo() {
  const user = await Auth.currentAuthenticatedUser();
  const key = user.attributes.sub + " currOrg";
  const org = await AsyncStorage.getItem(key);
  if (org == null) {
    return;
  }
  const orgJSON = JSON.parse(org);
  if (orgJSON.organizationManagerUserId == user.attributes.sub) {
    setIsManager(true);
  }
  setOrgName(orgJSON.name);
  setAccessCode(orgJSON.accessCode);
}

// from MemberTabs.js
async function checkUserOrg() {
  setIsManager(false);
  const user = await Auth.currentAuthenticatedUser();
  const key = user.attributes.sub + " currOrg";
  const org = await AsyncStorage.getItem(key);
  if (org == null) {
    navigation.navigate("JoinOrCreate");
    return;
  }
  const orgJSON = JSON.parse(org);
  setCurrOrgName(orgJSON.name);
  //organizationManagerUserId
  if (orgJSON.organizationManagerUserId == user.attributes.sub) {
    setIsManager(true);
  }
}

// From SwapEquipment.js

// reassign the equipment
async function reassignEquipment(item, assignedTo) {
  try {
    setIsLoading(true);
    const toCurrentUser = user.attributes.sub == assignedTo ? true : false;
    const key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    let orgUserStorage;
    // current user
    if (toCurrentUser) {
      orgUserStorage = await DataStore.query(OrgUserStorage, (c) =>
        c.and((c) => [
          c.organization.name.eq(orgJSON.name),
          c.user.userId.eq(user.attributes.sub),
        ]),
      );
      orgUserStorage = orgUserStorage[0];
    } else {
      orgUserStorage = await DataStore.query(OrgUserStorage, assignedTo);
    }
    const equip = await DataStore.query(Equipment, item.id);
    if (orgUserStorage == null || orgUserStorage == [] || equip == null) {
      console.log("orgUserStorage: ", orgUserStorage);
      console.log("equip: ", equip);
      throw new Error("User or Equipment not found!");
    }
    const newEquip = await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.assignedTo = orgUserStorage;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    );
    setIsLoading(false);
    Alert.alert("Equipment swapped!");
  } catch (e) {
    console.log(e);
    setIsLoading(false);
    Alert.alert("Swap Error!", e.message, [{ text: "OK" }]);
  }
}

async function subscribeToChanges() {
  DataStore.observeQuery(Equipment).subscribe((snapshot) => {
    const { items, isSynced } = snapshot;
    console.log(
      `Swap Equipment item count: ${items.length}, isSynced: ${isSynced}`,
    );
    getEquipment(user.attributes.sub);
    if (swapUser.current != null) getEquipment(swapUser.current.id);
  });
}
async function getEquipment(swapId) {
  try {
    const isCurrentUser = user.attributes.sub == swapId ? true : false;
    const key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    // passed in orgUserStorage
    let orgUserStorage;
    if (isCurrentUser) {
      orgUserStorage = await DataStore.query(OrgUserStorage, (c) =>
        c.and((c) => [
          c.organization.name.eq(orgJSON.name),
          c.user.userId.eq(user.attributes.sub),
          c.type.eq(UserOrStorage.USER),
        ]),
      );
      orgUserStorage = orgUserStorage[0];
    } else {
      orgUserStorage = await DataStore.query(OrgUserStorage, swapId);
    }
    const equipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorage.id),
    );
    const equipmentData = processEquipmentData(equipment);
    if (isCurrentUser) setListOne(equipmentData);
    else setListTwo(equipmentData);
  } catch (e) {
    console.log(e);
    Alert.alert("Swap Get Error!", e.message, [{ text: "OK" }]);
  }
}

// get duplicates and merge their counts
function processEquipmentData(equipment) {
  const equipmentMap = new Map();
  equipment.forEach((equip) => {
    if (equipmentMap.has(equip.name)) {
      const existingEquip = equipmentMap.get(equip.name);
      existingEquip.count += 1; // Increment the count
      existingEquip.data.push(equip.id); // Add the equipment to the data array
      equipmentMap.set(equip.name, existingEquip); // Update the Map
    } else {
      equipmentMap.set(equip.name, {
        id: equip.id,
        label: equip.name,
        count: 1,
        data: [equip.id],
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
}

// From TeamEquipment.js
async function subscribeToChanges() {
  DataStore.observeQuery(Equipment).subscribe((snapshot) => {
    const { items, isSynced } = snapshot;
    console.log(
      `teamEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
    );
    getOrgEquipment();
  });
}

async function getOrgEquipment() {
  const user = await Auth.currentAuthenticatedUser();
  const key = user.attributes.sub + " currOrg";
  const org = await AsyncStorage.getItem(key);
  if (org == null) {
    return;
  }
  const orgJSON = JSON.parse(org);
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.organization.id.eq(orgJSON.id),
  );
  // get the names of each orgUserStorage
  const orgUserStorageNames = orgUserStorages.map((orgUserStorage) => ({
    id: orgUserStorage.id,
    name: orgUserStorage.name,
  }));
  setOrgUserStorages(orgUserStorageNames);
  let equipment = [];
  for (let i = 0; i < orgUserStorages.length; i++) {
    const userEquipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorages[i].id),
    );
    const processedEquipment = processEquipmentData(userEquipment);
    equipment.push(processedEquipment);
  }
  setOrgEquipment(equipment);
}

// get duplicates and merge their counts
function processEquipmentData(equipment) {
  const equipmentMap = new Map();

  equipment.forEach((equip) => {
    if (equipmentMap.has(equip.name)) {
      const existingEquip = equipmentMap.get(equip.name);
      existingEquip.count += 1;
      existingEquip.data.push(equip.id);
      equipmentMap.set(equip.name, existingEquip);
    } else {
      equipmentMap.set(equip.name, {
        id: equip.id,
        label: equip.name,
        count: 1,
        data: [equip.id],
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
}

// From UserStorages.js
// subscribe to changes in equipment
async function subscribeToChanges() {
  DataStore.observeQuery(OrgUserStorage).subscribe((snapshot) => {
    const { items, isSynced } = snapshot;
    console.log(
      `table [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
    );
    getData();
  });
}

async function getData() {
  const user = await Auth.currentAuthenticatedUser();
  const key = user.attributes.sub + " currOrg";
  const org = await AsyncStorage.getItem(key);
  if (org == null) {
    return;
  }
  const orgJSON = JSON.parse(org);
  setOrgName(orgJSON.name);
  const manager = await DataStore.query(User, (c) =>
    c.userId.eq(orgJSON.organizationManagerUserId),
  );
  setManager(manager[0]);
  if (orgJSON.organizationManagerUserId == user.attributes.sub)
    setIsManager(true);
  let data;
  if (tab === "Members") {
    data = await DataStore.query(OrgUserStorage, (c) =>
      c.and((c) => [
        c.organization.name.eq(orgJSON.name),
        c.user.userId.ne(orgJSON.organizationManagerUserId),
        c.type.eq("USER"),
      ]),
    );
  } else {
    data = await DataStore.query(OrgUserStorage, (c) =>
      c.and((c) => [
        c.organization.name.eq(orgJSON.name),
        c.type.eq("STORAGE"),
      ]),
    );
  }
  setCurrData(data);
}
const handleCreate = async () => {
  if (!isManager) Alert.alert("You need to be a manager to create a storage!");
  else navigation.navigate("CreateStorage");
};
