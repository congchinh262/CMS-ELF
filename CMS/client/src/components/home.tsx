import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Button } from "antd";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "antd/dist/antd.css";
import "../styles/home.css";

import User from "./User";
import Role from "./Role";

import {
  Layout,
  Menu,
  Breadcrumb,
  Statistic,
  Card,
  Row,
  Col,
  Divider,
  Spin,
  Space,
} from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { OmitProps } from "antd/lib/transfer/ListBody";

//#region define antd const
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Meta } = Card;
//#endregion

interface IUser {
  _id: string;
  name: string;
  role: string[];
}

interface IRole{
  _id:string;
  name:string;
  permission:string[];
}

interface ICointainerProps{
  data:any;
}

//#region Schema
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
const GET_ALL_ROLES = gql`
  query{
 	roles{
    _id
    name
    permission
  }
}
`;
//#endregion

function Homepage() {
  const { loading, error,data } = useQuery(GET_ALL_USERS);
  
  if (loading) {
    return (
      <div id="container">
        <Space size="large">
          <div className="spinload">
            <Spin size="large" />
          </div>
        </Space>
      </div>
    );
  }
  if (error) {
    return <div>Something goes wrong here :((</div>;
  }
  function countUser() {
    let count = 0;
    data.users.map((user: IUser) => {
      count++;
    });
    return count as string | number | undefined;
  }
  return (
    <Router>
      <Layout>
        <MainHeader />
        <Layout>
          <SliderBar />
          <Switch>
            <Route path="/roles" exact component={Role}></Route>
            <Route path="/users" exact component={User}></Route>
            <Route path="/"><MainContainer data={data} /></Route>
          </Switch>
        </Layout>
      </Layout>
    </Router>
  );
}
const MainContainer = (props:ICointainerProps) => {
  const { loading, error,data } = useQuery(GET_ALL_ROLES);
  const limitData = (numLimit:number,data:[])=>{
    const itemList:[]=[];
    data.map((item)=>{
      if(numLimit > 0){
        numLimit--;
        itemList.push(item);
      }
    })
    return itemList;
  }
  return (
    <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          backgroundColor: "white",
        }}
      >
        <div className="site-statistic-demo-card" style={{ margin: 10 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Users"
                  value={props.data.users.length}
                  valueStyle={{ color: "black" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Role"
                  value={data.roles.length}
                  valueStyle={{ color: "black" }}
                />               
              </Card>
            </Col>
          </Row>
        </div>
        <Divider />
        <div className="site-card-wrapper">
          <Row gutter={16}>
            <Col span={8}>
              <Card
                title="Users"
                bordered={false}
                style={{ boxShadow: " 1px 1px 5px 1px rgba(50, 50, 50, 0.5)" }}
                extra={<Link to="/users"><a>More</a></Link>}
              >
                {limitData(1,props.data.users).map((user:IUser)=>{
                  return(
                    <p>{user.name}</p>
                  )
                })}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="Roles"
                bordered={false}
                style={{ boxShadow: " 1px 1px 5px 1px rgba(50, 50, 50, 0.5)" }}
                extra={<Link to="/roles"><a>More</a></Link>}
              >
                {limitData(1,data.roles).map((role:IRole)=>{
                  return(
                    <p>{role.name}</p>
                  )
                })}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

const MainHeader: React.FC = () => {
  const [current, setCurrent] = useState("");
  const handleClick = (e: any) => {
    console.log("click ", e);
    setCurrent(e.key);
  };
  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="mail" icon={<MailOutlined />}>
        Navigation One
      </Menu.Item>
      <Menu.Item key="app" disabled icon={<AppstoreOutlined />}>
        Navigation Two
      </Menu.Item>
      <SubMenu
        key="SubMenu"
        icon={<SettingOutlined />}
        title="Navigation Three - Submenu"
      >
        <Menu.ItemGroup title="Item 1">
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      <Menu.Item key="alipay">
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Navigation Four - Link
        </a>
      </Menu.Item>
    </Menu>
  );
};

const SliderBar = () => {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
          <Menu.Item key="1">
            <Route path="/users" exact component={User}>
              <Link to={"/users"}>Users</Link>
            </Route>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to={"/roles"}>Roles</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
          <Menu.Item key="5">option5</Menu.Item>
          <Menu.Item key="6">option6</Menu.Item>
          <Menu.Item key="7">option7</Menu.Item>
          <Menu.Item key="8">option8</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
          <Menu.Item key="9">option9</Menu.Item>
          <Menu.Item key="10">option10</Menu.Item>
          <Menu.Item key="11">option11</Menu.Item>
          <Menu.Item key="12">option12</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Homepage;
