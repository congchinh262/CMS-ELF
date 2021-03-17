import React, { useState,useEffect } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import Layout from "antd/lib/layout/layout";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LOGIN = gql`
  mutation Login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

const Login = () => {
  const [login, data] = useMutation(LOGIN);
  const [userName, setUsername] = useState("");
  const [pw, setUserPw] = useState("");
  const history = useHistory();
  const onFinish =  (values: any) => {
     login({
      variables: {
        userName: userName,
        password: pw,
      },
    });
   
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("failed");
    return <div>Something goes wrong here: {errorInfo}</div>;
  };

  useEffect(() =>{
    console.log(data);
    if (data && !data.loading && data.called) {
      const token = data.data.login.token;
      
      localStorage.setItem("token", token);
      history.goBack();
    }
  },[data])

  return (
    <Layout style={{ padding: "24px 24px 12px", backgroundColor: "white" }}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input onChange={(e) => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password onChange={(e) => setUserPw(e.target.value)} />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default Login;
