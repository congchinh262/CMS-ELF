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

  const handleSearch = (val: string) => {
    // let item: keyof typeof Obj;
    // //item is specific for properties in object
    // for(item in Obj){
    //     let result:any = Obj[item];
    //     if(typeof(result)==="object"){
    //         handleSearch(val,result);
    //     };
    //     if(val===result){
    //         return setResult(Obj);
    //     }
    // }
    const searchResult = data.users.filter((obj: any) => {
      if (obj._id === val || obj.name === val || obj.role.name === val) {
        return obj;
      }
    });
    setResult(searchResult);
  };

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
      <AutoComplete
        style={{ width: 200 }}
        onSearch={handleSearch}
        placeholder="input here"
      >
        {result.map((res:IState)=>{
            
        })}
      </AutoComplete>
      <Table columns={columns} dataSource={tableData}></Table>
    </Layout>
  );
};
export default User;
