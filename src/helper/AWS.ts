/*
    Call an AWS API Gateway endpoint that uses a lambda function
    to create a user group and add a user to the group.
*/
const userGroupUrl = process.env.EXPO_PUBLIC_API + "/user-group";

// create a user group with the given name
export const createUserGroup = async (
  jwtToken: string,
  userGroupName: string,
) => {
  console.log("url: ", userGroupUrl);
  const response = await fetch(userGroupUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userGroupName,
    }),
  });
  console.log(response);
  return await response.json();
};

// add a user of the given userId to the user group of the given name
export const addUserToGroup = async (
  jwtToken: string,
  userGroupName: string,
  userId: string,
) => {
  const response = await fetch(userGroupUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: userGroupName,
      userId: userId,
    }),
  });
  console.log(response);
  return await response.json();
};
