const User = require("../models/user");
const Role = require("../models/role");

module.exports = async (user) => {
  const role = (await Role.findById(user.role)).toObject();
  return { ...user.toObject(), role };
};
