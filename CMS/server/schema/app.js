const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id:ID!
        name:String!
        password:String
        role:Role!
    }

    input UserInput{
        name:String!
        password:String!
        role:String!
    }
    input UserUpdateInput{
        _id:String!
        name:String
        role:String
    }

    type Role{
        _id:ID!
        name:String!
        permission:[String!]
    }
    
    input RoleInput{
        name:String!
        permission:[String!]
    }

    input RoleUpdateInput{
        _id:ID!
        name:String
        permission:[String]
    }
    type AuthData{
        userId:ID!
        token: String!
        tokenExpiration: Int!
    }

    type RootQuery{
        users:[User!]
        roles:[Role!]
        login(userName: String!,password:String!):AuthData
    }



    type RootMutation{
        createUser(userInput:UserInput):User
        createRole(roleInput:RoleInput):Role
        updateUser(userUpdateInput:UserUpdateInput!):User
        deleteUser(userId:String!):Boolean
        updateRole(roleUpdateInput:RoleUpdateInput!):Role
        deleteRole(roleId:String!):Boolean
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
`);