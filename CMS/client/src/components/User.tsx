import React, { useState } from "react";
import "../styles/user.css";
import { useQuery, gql } from "@apollo/client";
import UserEdit from "./UserEdit"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { Layout, Table, Tag, Space, AutoComplete } from "antd";

interface IUser {
  _id: string;
  name: string;
  role: {
    name: string;
  };
}

interface IUserEdit {
  data:any;
}

interface IState {
  result: string[];
}

const GET_ALL_USERS = gql`
  query {
    users {
      _id
      name
      role {
        name
      }
    }
  }
`;

const User: React.FC<IState> = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [result, setResult] = useState<{}>();
  const tableData: any = [];

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (text: any) => (
        <Space size="middle">
          <Link to="/user-edit"><a>Edit</a></Link>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Table columns={columns} dataSource={tableData} loading={true}></Table>
    );
  }
  if (error) {
    return <div>Something when wrong here :(</div>;
  }
  data.users.map((user: IUser) => {
    let keyCount = 0;
    return tableData.push({
      key: keyCount++,
      id: user._id,
      name: user.name,
      role: user.role.name,
    });
  });
  return (
    <Router>
      <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>      
        <Switch>
          <Route path="/user-edit"><UserEdit data={data}/></Route>
          <Route path="/users" ><Table columns={columns} dataSource={tableData}></Table></Route>
          <Redirect to="/users" />
        </Switch>
      </Layout>
    </Router>
  );
};
export default User;
