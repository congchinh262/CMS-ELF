import React from "react";
import { Form, Input, Button, Radio, InputNumber, Select } from "antd";
import { gql, useMutation, useQuery } from "@apollo/client";
import Layout from "antd/lib/layout/layout";
import { useParams } from "react-router";

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
  }
`;

const UPDATE_USER = gql`
   mutation($user: UserUpdateInput!) {
    updateUser(userUpdateInput: $user) {
      name
      role {
        _id
      }
    }
  }
`;

const { Option } = Select;
function handleChange(value: any) {
  console.log(`selected ${value}`);
}

const UserEdit = (props: IUserEditProps, userId: string) => {
  let { id } = useParams<{ id: string }>();
  userId = id;
  const { loading, error, data } = useQuery(GET_SINGLE_USER, {
    variables: { userId: userId },
  });
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
  const onFinish = (values: any) => {};
  return (
    <Layout style={{ padding: "0 24px 0 24px", backgroundColor:"white" }}>
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
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
            {data.getSingleUser.map((user: any) => {
              const permissions = user.role.permission;
              return (
                <>
                  {permissions.map((permission: string) => {
                    return <Option value={permission}>{permission}</Option>;
                  })}
                </>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default UserEdit;
