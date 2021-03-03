import React, { useState } from "react";
import "../styles/user.css";
import { useQuery, gql } from "@apollo/client";
import { Layout, Table, Tag, Space, AutoComplete } from "antd";

interface IUser {
  _id: string;
  name: string;
  role: {
    name: string;
  };
}

interface IProps {

}

interface IState{
    result:string[];
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
          <a>Edit</a>
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
  console.log(data);
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
    <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>
      <Table columns={columns} dataSource={tableData}></Table>
    </Layout>
  );
};
export default User;
