import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';


interface IUser{
  _id:string
  name:string
  role:string[]
}

const GET_ALL_USERS = gql`
  query {
        users {
          _id
          name
          role {
            permission
          }
        }
      }
`;

function App() {
  const {loading,error,data} = useQuery(GET_ALL_USERS);
  if(loading){
    return (<div>...loading</div>)
  }
  if(error){
    return (<div>Something goes wrong here :((</div>)
  }
  return data.users.map((user:IUser) => {
    {console.log(user.name)}
    return(<div key={user._id}>
      
      <p>
        name: {user.name}
      </p>
      
      <p>
        role: {JSON.stringify(user.role)}
      </p>
    </div>)
  });
}

export default App;
