import React, { useEffect } from "react";
import { Form, Input, Button, Radio, InputNumber, Select } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import Layout from "antd/lib/layout/layout";
import { useParams } from "react-router";
import { useState } from "react";

interface IUser {
  _id: string;
  name: string;
  role: string;
}

interface IUserEditProps {}

interface ISubmitFormProps {
  submitData: any;
}
const GET_SINGLE_USER = gql`
  query GetSingleUser($userId: String!) {
    getSingleUser(userId: $userId) {
      _id
      name
      role {
        _id
        name
        permission
      }
    }
    roles {
      _id
      name
      permission
    }
  }
`;

const UPDATE_USER = gql`
  mutation($user: UserUpdateInput!) {
    updateUser(userUpdateInput: $user) {
      name
      password
      role {
        _id
      }
    }
  }
`;

const { Option } = Select;

const UserEdit = (props: IUserEditProps, userId: string) => {
  let { id } = useParams<{ id: string }>();
  userId = id;
  const { loading, error, data } = useQuery(GET_SINGLE_USER, {
    variables: { userId: userId },
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [userPwInput, setUserPwInput] = useState("");
  const [userRoleInput, setUserRoleInput] = useState("");

  const [updateUser] = useMutation(UPDATE_USER);
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error! ${error}</div>;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  function handleChange(value: any) {
    const roleWithName=data.roles.find((element:any) => element.name===value);
    setUserRoleInput(roleWithName._id);
  }
  const onFinish = (e: any) => {
    updateUser({
      variables: {
        user: {
            _id: userId,
            name: usernameInput,
            role: userRoleInput,
        },
      },
    });
    console.log(userId+" "+usernameInput+" "+userRoleInput);
  };

  const onFinishFailed = (error: any) => {
    console.log("Failed: " + error);
  };

  return (
    <Layout style={{ padding: "0 24px 0 24px", backgroundColor: "white" }}>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["user", "name"]}
          label="Username"
          rules={[{ required: true }]}
        >
          <Input
            defaultValue={data.getSingleUser.map((user: any) => {
              return user.name;
            })}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name={["user", "role"]}
          label="Role"
          rules={[{ required: true }]}
        >
          <Select
            defaultValue={data.getSingleUser.map((user: any) => {
              return user.role.name;
            })}
            style={{ width: 120 }}
            onChange={handleChange}
          >
            {data.roles.map((role: any) => {
              return <Option value={role.name}>{role.name}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default UserEdit;
