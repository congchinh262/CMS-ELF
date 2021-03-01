const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const appSchema = require("./schema/app");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
const User = require("./models/user");
const Role = require("./models/role");
const Permission = require("./models/permission");
const permission = require("./models/permission");

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: appSchema,
    rootValue: {
      users: async () => {
        const users = await User.find();
        const userWithRoles = await Promise.all(
          users.map(async (user) => {
            const role = await Role.findById(user.role);          
            return {
              ...user.toObject(),
              _id: user._id.toString(),
              role
            };
          })
        );
        return userWithRoles;
      },
      roles: async () => {
        try {
          const roles = await Role.find();
          return roles.map(role=>{
            return {...role.toObject()}
          })
        } catch (err) {
          throw err;
        }
      },
      //   permission: async () => {
      //     const permissions = await Permission.find();
      //     return permissions;
      //   },
      createUser: async (args) => {
        try {
          const existedUser = await User.findOne({ name: args.userInput.name });

          if (existedUser) {
            throw new Error("Username is already used!");
          }
          const hashedPW = await bcrypt.hash(args.userInput.password, 12);
          const user = new User({
            name: args.userInput.name,
            password: hashedPW,
            role: args.userInput.role,
          });
          const { password, ...result } = (await user.save()).toObject();
          return { ...result, password: "" };
        } catch (error) {
          throw error;
        }
      },
      createRole: async (args) => {
        try {
          const existedRole = await Role.findOne({ name: args.roleInput.name });
          if (!existedRole) {
            const role = new Role({
              name: args.roleInput.name,
              permission: args.roleInput.permission,
            });
            const result = (await role.save()).toObject();
            return { ...result };
          } else {
            throw new Error("Role existed!");
          }
        } catch (error) {
          throw error;
        }
      },
      //#region cmt
      //   createPermission: async (args) => {
      //     try {
      //       const existedPermission = await Permission.findOne({
      //         name: args.permissionInput.name,
      //       });
      //       if (!existedPermission) {
      //         const permission = new Permission({
      //           name: args.permissionInput.name,
      //           description: args.permissionInput.description,
      //         });
      //         const result = (await permission.save()).toObject();
      //         return { ...result };
      //       } else {
      //         throw Error("Permission existed!");
      //       }
      //     } catch (error) {
      //       throw error;
      //     }
      //   },
      //#endregion
    },
    graphiql: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then( ()=>{
    
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });
