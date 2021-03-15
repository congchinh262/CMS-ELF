import React, { useState } from "react";
import "../styles/user.css";
import { useQuery, gql } from "@apollo/client";
import UserEdit from "./UserEdit";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Button, Radio } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { Layout, Table, Tag, Space, AutoComplete } from "antd";

interface IUser {
  _id: string;
  name: string;
  role: {
    name: string;
  };
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

const User: React.FC = () => {
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
      dataIndex: "id",
      key: "action",
      render: (id: string) => (
        <Space size="middle">
          <Link to={"/user-edit/" + id}>
            <a>Edit</a>
          </Link>
          <Link to={"/user-delete/" + id}>
            <a>Delete</a>
          </Link>
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
    tableData.push({
      id: user._id,
      name: user.name,
      role: user.role.name,
    });
    return tableData;
  });
  return (
    <React.Fragment>
      <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>
        <Link to="/create-user">
          <Button type="primary" icon={<UserAddOutlined />} size="large">
            New User
          </Button>
        </Link>
        <Table columns={columns} dataSource={tableData}></Table>
      </Layout>
    </React.Fragment>
  );
};

export default User;
