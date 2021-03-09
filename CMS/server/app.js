const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { ApolloServer, AuthenticationError } = require('apollo-server-express');

const isAuth = require("./middlewares/isAuth");
const User = require("./models/user");

const app = express();
app.use(bodyParser.json());

const appSchema = require("./schema/app");
const resolver = require('./resolvers/resolvers-app');


app.use(cors());

// app.use(isAuth);

const typeDefs = appSchema;

const resolvers = resolver;


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:isAuth
});

server.applyMiddleware({ app });
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });
