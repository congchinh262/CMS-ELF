const { gql } = require("apollo-server-express");

module.exports = gql`
  enum Permission{
    READEALE
    EDITABLE
    DELETEABLE
    ADDABLE
  }

  type User {
    _id: ID!
    name: String!
    password: String
    role: Role!
  }

  input UserInput {
    name: String!
    password: String!
    role: String!
  }
  input UserUpdateInput {
    _id: String!
    name: String
    role: String
  }

  type Role {
    _id: ID!
    name: String!
    permission: [String!]
  }

  input RoleInput {
    name: String!
    permission: [String!]
  }

  input RoleUpdateInput {
    _id: ID!
    name: String
    permission: [String]
  }
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Query {
    users: [User!]
    roles: [Role!]
    getSingleUser(userId: String!): User!
    getSingleRole(roleId: String!): Role!
  }

  type Mutation {
    createUser(userInput: UserInput): User
    createRole(roleInput: RoleInput): Role
    updateUser(userUpdateInput: UserUpdateInput!): User
    deleteUser(userId: String!): Boolean
    updateRole(roleUpdateInput: RoleUpdateInput!): Role
    deleteRole(roleId: String!): Boolean
    login(userName: String!, password: String!): AuthData
    logout(token:String!):Boolean
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;
