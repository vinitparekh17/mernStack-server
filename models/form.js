const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const { v4 } = require("uuid")
const userSchema = Schema({
    "firstName": String,
    "lastName": String,
    "email": String,
    "password": String,
    "cpassword": String,
    tokens: [
        {
            "token": String
        }
    ]
});

// securing password 

// userSchema.pre('save', function (next) {
//     if (this.isModified('password')) {
//         this.password = bcrypt.hash(this.password, 12);
//         this.cpassword = bcrypt.hash(this.cpassword, 12);
//     }
//     next();
// })

// generating token

userSchema.methods.generateAuthToken = async function () {
    try {
        let token = v4();
        console.log(token);
        await token.save();
        return token;
    } catch (e) {
        console.log(e);
    }
}

const Form = new model("form", userSchema);

module.exports = Form;