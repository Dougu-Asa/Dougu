/*
    Call an AWS API Gateway endpoint that uses a lambda function
    to create a user group and add a user to the group.
*/
export const createUserGroup = async (
  jwtToken: string,
  userGroupName: string,
) => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_API || "", {
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
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user group");
  }
};

export const addUserToGroup = async (
  jwtToken: string,
  userGroupName: string,
  userId: string,
) => {
  try {
    const response = await fetch(process.env.EXPO_PUBLIC_API || "", {
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
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add user to group");
  }
};
