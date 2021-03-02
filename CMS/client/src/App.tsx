import React, { useEffect, useState } from 'react';
import logo from "./logo.svg";
import "./App.css";
import { useQuery, gql } from "@apollo/client";
import "antd/dist/antd.css";

import Homepage from "./components/home"

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
//no chui t thi ua ok chua
function App() {
    return (
      <Homepage></Homepage>
    )
}

export default App;
