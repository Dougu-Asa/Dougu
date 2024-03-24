import { createUser } from '../src/graphql/mutations';

const user = await Auth.signIn(email, password);
const newUser = { id: user.attributes.sub, name: user.attributes.name, email: user.attributes.email};

await API.graphql({
    query: createUser,
    variables: {
      input: newUser
    }
  });