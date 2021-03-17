const jwt = require("jsonwebtoken");
const getUserWithRole = require("../helper/getUserWithRoleHelper");
const { AuthenticationError } = require("apollo-server");

const User = require("../models/user");
const Role = require("../models/role");

module.exports = ({req,res}) => {
  const header = req.headers.authorization;
  if (!header) return { isAuth: false };
  const token = header.split(" ");
  if (!token) return { isAuth: false };
 
  try {
    decodedToken = jwt.verify(token[1],"superultrahypermegasecret" );
  } catch (error) {
    return { isAuth: false,error:error };
  }
  if (!decodedToken) return { isAuth: false};
  
  return {
    isAuth: true,
    userId: decodedToken.userId,
    permission:decodedToken.permission
  };
};
