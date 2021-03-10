const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Role = require("../models/role");

const isAuth = require("../middlewares/isAuth");
const GetUserWithRole = require("../helper/getUserWithRoleHelper");
const { AuthenticationError } = require("apollo-server");



module.exports = {
  Query: {
    users: async () => {
      const users = await User.find();
      const userWithRoles = await Promise.all(
        users.map(async (user) => {
          const role = (await Role.findById(user.role)).toObject();
          return {
            ...user.toObject(),
            _id: user._id.toString(),
            role,
          };
        })
      );
      return userWithRoles;
    },
    roles: async () => {
      try {
        const roles = await Role.find();
        return roles.map((role) => {
          return { ...role.toObject() };
        });
      } catch (err) {
        throw err;
      }
    },
    getSingleUser: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        const userWithRole = GetUserWithRole(user);
        const result = [];
        result.push(userWithRole);
        return result;
      } catch (error) {
        throw error;
      }
    },
    getSingleRole: async (_, { roleId }) => {
      try {
        const role = (await Role.findById(roleId)).toObject();
        return role;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createUser: async (_, args) => {
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
        console.log(result);
        return { ...result, password: "" };
      } catch (error) {
        throw error;
      }
    },
    createRole: async (_, args, isAuth) => {
      if (!isAuth) {
        throw new AuthenticationError("You must login!");
      }
      if(!isAuth.permission.includes("ADDABLE")){
        throw new AuthenticationError("You dont have permission to do that!");
      }
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
    updateUser: async (_, args,isAuth) => {
      if(!isAuth && isAuth.permission===undefined){
        throw new AuthenticationError("You must logged in!");
      }
      if(!isAuth.permission.includes("EDITABLE")){
        throw new AuthenticationError("You dont have permission to do this!")
      }
      try {
        if (!args.userUpdateInput._id) {
          throw new Error("Id not match!");
        }
        const filter = { _id: args.userUpdateInput._id };
        const update = {
          name: args.userUpdateInput.name,
          password: args.userUpdateInput.password,
          role: args.userUpdateInput.role,
        };
        for (var key in update) {
          if (update[key] === undefined) {
            delete update[key];
          }
        }
        const user = await User.findOneAndUpdate(filter, update, {
          new: true,
        });
        return { ...user.toObject() };
      } catch (error) {
        throw error;
      }
    },
    deleteUser: (_, args,isAuth) => {
      if(!isAuth){
        throw new AuthenticationError("You must logged in!");
      }
      if(!isAuth.permission.includes("DELETEABLE")){
        throw new AuthenticationError("You dont have permission to do this!")
      }
      console.log(args);
      User.findByIdAndDelete(args.userId)
        .then(() => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    },
    updateRole: async (_, args,isAuth) => {
      if(!isAuth){
        throw new AuthenticationError("You must logged in!");
      }
      if(!isAuth.permission.includes("EDITABLE")){
        throw new AuthenticationError("You dont have permission to do this!")
      }
      try {
        if (!args.roleUpdateInput._id) {
          throw new Error("Role id not match!");
        }
        const filter = { _id: args.roleUpdateInput._id };
        const update = {
          name: args.roleUpdateInput.name,
          permission: args.roleUpdateInput.permission,
        };
        for (var key in update) {
          if (update[key] === undefined) {
            delete update[key];
          }
        }
        const role = await Role.findOneAndUpdate(filter, update, {
          new: true,
        });
        return { ...role.toObject() };
      } catch (error) {
        throw error;
      }
    },
    deleteRole: async (_, args,isAuth) => {
      if(!isAuth){
        throw new AuthenticationError("You must logged in!");
      }
      if(!isAuth.permission.includes("DELETEABLE")){
        throw new AuthenticationError("You dont have permission to do this!")
      }
      try {
        const roleDeleted = await Role.findByIdAndDelete(
          args.roleInput._id
        );
        return true;
      } catch (error) {
        return false;
      }
    },
    login: async (_, { userName, password }, isAuth) => {
      if (!isAuth) {
        return {
          error: true,
          message: "Auth failed!",
        };
      }
      console.log(isAuth);
      const user = await User.findOne({ name: userName });
      if (!user) {
        throw new Error("User doesn't exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Incorrect password!");
      }
      
      const role  = await Role.findById(user.role);
  
      const permission = role.permission;
      const token = jwt.sign(
        { userId: user._id,  permission:permission},
        "superultrahypermegasecret",
        { algorithm: "HS256", expiresIn: "1h" }
      );
      return {
        userId: user._id,
        token: token,
        tokenExpiration: 1,
      };
    },
  },
};
