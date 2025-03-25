import './App.css'
import { useQuery, useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';

const GET_USERS = gql`
query GetUsers{
  getUsers {
    id
    age
    name
    isMarried
  }
}
`;

const GET_USERS_BY_ID = gql`
query GetUserById($id: ID!) {
  getUserById(id: $id) {
    id
    age
    name
    isMarried
  }
}
`;

const CREATE_USER = gql`
mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
  createUser(name: $name, age: $age, isMarried: $isMarried) {
    name
  }
}
`;


function App() {

  const [newUser, setNewUser] = useState({});

  const { data: getUsersData, error: getUsersError, loading: getUsersLoading } = useQuery(GET_USERS);

  const { data: getUserByIdData, error: getUserByIdError, loading: getUserByIdLoading } = useQuery(GET_USERS_BY_ID, {
    variables: { id: "2" }
  });

  const [createUser] = useMutation(CREATE_USER)


  if (getUsersLoading) return <p> Data loading.....</p>;

  if (getUsersError) return <p> Error: {getUsersError.message}</p>;

  const handleCreateUser = async () => {
    try {
      await createUser({
        variables: {
          name: newUser.name,
          age: Number(newUser.age),
          isMarried: false,
        },
        refetchQueries: [{ query: GET_USERS }],
      });
      alert("User created!");
    } catch (err) {
      alert("Failed to create user");
    }
  };


  return (
    <>
      <div>
        <input
          placeholder='Name...'
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          placeholder='Age...'
          type='number'
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, age: parseInt(e.target.value) }))
          }
        />
        <button onClick={handleCreateUser}> Create User</button>
      </div>

      <div>
        {getUserByIdLoading ? (<p> Loading user....</p>) : (
          <>
            <h1> Chosen User: </h1>
            <p>{getUserByIdData.getUserById.name}</p>
          </>
        )
        }
      </div>
      <div>
        <h1>Users</h1>
        <div> {getUsersData.getUsers.map((user) => (
          <div key={user.id}>
            <p> Name: {user.name}</p>
            <p> Age: {user.age}</p>
            <p> Married?: {user.isMarried ? "Yes" : "No"}</p>
          </div>
        ))}</div>
      </div>


    </>
  )
}

export default App
