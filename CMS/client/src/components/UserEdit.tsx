import React from "react";
import { Form, Input, Button, Radio, InputNumber } from "antd";
import { gql, useMutation } from "@apollo/client";
import Layout from "antd/lib/layout/layout";

interface IUser {
  _id: string;
  name: string;
  role: string;
}

interface IUserEditProps {
  data: any;
}

interface ISubmitFormProps {
  submitData: any;
}

const UPDATE_USER = gql`
  mutation{
  updateUser(userUpdateInput:{$_id:String!,$name:String,$role:String}){
    updateuser(_id:$_id,name:$name,role:$role){
      name
      role
    }
  }
}
`;

const UserEdit = (props: IUserEditProps) => {
  return (
    <Layout style={{ padding: "0 24px 0 24px" }}>
      <SubmitForm submitData={props.data}></SubmitForm>
    </Layout>
  );
};

export default UserEdit;

const SubmitForm = (props: ISubmitFormProps) => {
  const [updateUser] = useMutation(UPDATE_USER);
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
  return props.submitData.map((user: IUser) => {
    return (
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
          <Input defaultValue={user.name} />
        </Form.Item>
        <Form.Item
          name={["user", "email"]}
          label="Role"
          rules={[{ required:true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  });
};
