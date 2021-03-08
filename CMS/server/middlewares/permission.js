  
const { rule, shield, and, or, not } = require('graphql-shield');

const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
      return ctx.user !== null
    },
  )

const isAdmin = rule({cache:'contextual'})(
    async (parent, args, ctx, info) => {
        let isAdmin = ctx.user.roles.includes('ADMIN');
        console.log(`isAdmin = ${isAdmin}`);
        return isAdmin;
      }
)
const isEmployee = rule({cache:'contextual'})(
    async (parent, args, ctx, info) => {
        let isAdmin = ctx.user.roles.includes('EMPLOYEE');
        console.log(`isEmployee = ${isEmployee}`);
        return isEmployee;
      }
)
const isManager = rule({cache:'contextual'})(
    async (parent, args, ctx, info) => {
        let isManager = ctx.user.roles.includes('MANAGER');
        console.log(`isEmployee = ${isEmployee}`);
        return isManager;
      }
)

const permissions = shield({
    query:{
        users:and(isAuthenticated, or(isAdmin,isManager,isEmployee)),
        roles:and(isAuthenticated, or(isAdmin,isManager)),
        login:and(isAuthenticated, or(isAdmin,isManager,isEmployee))
    },
    mutation:{
        createUser:or(isAdmin,isEmployee),
        updateUser:or(isAdmin,isEmployee),
        deleteUser:isAdmin,
        createRole:isAdmin,
        updateRole:isAdmin,
        deleteRole:isAdmin,
    }
});

module.exports = permissions;
