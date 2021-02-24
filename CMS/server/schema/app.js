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

    type Role{
        _id:ID
        name:String!
        permission:[String!]
    }
    
    input RoleInput{
        name:String!
        permission:[String!]
    }

    type RootQuery{
        users:[User!]
        
    }

    type RootMutation{
        createUser(userInput:UserInput):User
        createRole(roleInput:RoleInput):Role
    }
    schema{
        query:RootQuery
        mutation:RootMutation
    }
`);