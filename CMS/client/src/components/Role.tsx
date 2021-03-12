import React from "react";
import { useQuery, gql } from "@apollo/client";
import UserEdit from "./UserEdit";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { Layout, Table, Tag, Space, AutoComplete } from "antd";
import RoleEdit from "./RoleEdit";

const GET_ALL_ROLES = gql`
  query {
    roles {
      _id
      name
      permission
    }
  }
`;
const Roles = () => {
  const { loading, error, data } = useQuery(GET_ALL_ROLES);
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
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: any[]) => (
        <>
          {permissions.map((permission: string) => {
            return (
              <Tag color="blue" key={permission}>
                {permission}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text: any) => (
        <Space size="middle">
          <Link to="/role-edit"><a>Edit</a></Link>
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
  data.roles.map((role: any) => {
    tableData.push({
      id: role._id,
      name: role.name,
      permissions: role.permission,
    });
    return tableData;
  });
  return (
    <Switch>
      <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>
        <Route path="/roles" exact>
          <Table columns={columns} dataSource={tableData}></Table>;
        </Route>
        <Route path="/role-edit">
          <RoleEdit></RoleEdit>
        </Route>
      </Layout>
    </Switch>
  );
};
export default Roles;
