const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Form = require("./models/form")

router.get("/", (req, res) => {
    res.send("hello")
})
// sighup route 
router.post("/signup", async (req, res) => {

    const { name, lastname, email, password, cpassword } = req.body;
    try {
        const registered = await Form.findOne({
            name, lastname, email, password, cpassword
        })

        if (registered) {
            return console.log("Already registered");
        } else if (password != cpassword) {
            return res.status(422).json({ erroe: "Password not matching1" })
        } else {
            const form = new Form({ name, lastname, email, password, cpassword })
            await form.save();
            console.log("Registration successfull!");
        }
    } catch (e) {
        console.log(e);
    }
})
// Signin route 
router.post("/signin", async (req, res) => {
    let token;
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({ error: "Details not filled!" })
        }

        // finding the user in db 
        const userLogin = await Form.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true
            });
            if (!isMatch) {
                return res.status(404).json({ error: "user not found" })
            } else {
                return res.json({ message: "user found!" })
            }
        } else {
            return res.status(404).json({ error: "user not found" })
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;