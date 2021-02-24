const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const appSchema = require('./schema/app')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
const User = require('./models/user');
const Role = require('./models/role');

app.use('/graphql', graphqlHTTP({
    schema: appSchema,
    rootValue: {
        users: () => {
            return User.find().then().catch(error => {
                throw error;
            });
        },
        role: () => {
            return Role.find().catch(error => {
                throw error;
            })
        },
        createUser: args => {
            return User.findOne({ name: args.userInput.name }).then(user => {
                if (user) {
                    console.log("1")
                    throw new Error('Username is already used!');
                }
                return bcrypt.hash(args.userInput.password)
                    .then(hashedPW => {
                        const user = new User({
                            name: args.userInput.name,
                            password: hashedPW,
                            role: args.userInput.role
                        });
                        console.log("2")
                        return user.save();
                    })
                    .then(result => {
                        console.log(result);
                        return {...result._doc, password: null };
                    })
                    .catch(error => {
                        throw error;
                    })
            })
        },
        createRole: args => {
            const role = new Role({
                name: args.roleInput.name,
                permission: args.roleInput.permission
            });
            return role.save()
                .then(result => {

                    return {...result._doc };
                })
                .catch(error => {
                    throw error;
                })
        }
    },
    graphiql: true
}));

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(app.listen(3000))
    .catch(err => {
        throw err;
    });