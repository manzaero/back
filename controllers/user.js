const bcrypt = require("bcrypt");
const User = require("../models/User");
const {generate} = require("../helpers/token");
const ROLES = require("../constants/roles");
//register

async function register (name, email, password) {
    if (!password){
        throw new Error("Password is empty");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: passwordHash});

    const token = generate({id: user.id});

    console.log('Registered user:', user);

    return { user, token };
}

async function login (email, password) {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error("User does not exist");
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword){
        throw new Error("Password is incorrect");
    }

    const token = generate({id: user.id})

    return { token, user }
}


module.exports = {register, login}