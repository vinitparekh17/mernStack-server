const bcrypt = require("bcryptjs");
const { json } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Form = require("./models/form")

router.get("/", (req, res) => {
    res.send("hello")
})
// sighup route 
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, cpassword } = req.body;
    try {
        const registered = await Form.findOne({
            firstName, lastName, email, password, cpassword
        })

        if (registered) {
            return res.status(422).json("Already registered");
        } else if (password != cpassword) {
            return (res.status(422).json({ erroe: "Password not matching1" })
            )
        } else {
            const form = new Form({ firstName, lastName, email, password, cpassword })
            await form.save();
            return res.status(200).json({ message: "Registration successfull!" });
        }
    } catch (e) {
        console.log(e);
    }
})
// Signin route 
router.post("/signin", async (req, res) => {
    let token;
    try {
        const { email, password, cpassword } = req.body;
        if (!email && !password) {
            return res.status(400).json({ error: "Details not filled!" })
        }

        // finding the user in db 
        const userLogin = await Form.findOne({ email: email });

        if (userLogin) {
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("cookie", token, {
                expires: new Date(Date.now() + 86400000),
                httpOnly: true
            });
            if (password !== cpassword) {
                return res.status(404).json({ error: "User not found" })
            } else {
                return res.json({ message: "User found!" })
            }
        } else {
            return res.status(404).json({ error: "User not found" })
        }
    } catch (e) {
        console.log(e)
    }
})
let data;
router.post("/anime", (req, res) => {
    const { option } = req.body;
    const { get } = require("https");

    var optValue = null;
    if (option == "1") {
        optValue = "neko";
    } else if (option == "2") {
        optValue = "hug";
    } else if (option == "3") {
        optValue = "pat";
    } else if (option == "4") {
        optValue = "waifu";
    } else if (option == "5") {
        optValue = "cry";
    } else if (option == "6") {
        optValue = "kiss";
    } else if (option == "7") {
        optValue = "slap";
    } else if (option == "8") {
        optValue = "smug";
    } else if (option == "9") {
        optValue = "punch";
    } else {
        console.log("something went wrong!")
    }
    var url = `https://neko-love.xyz/api/v1/${optValue}`;
    get(url, (response) => {
        const { statusCode } = res;
        if (statusCode != 200) {
            response.resume;
        }
        response.setEncoding("utf8");
        let rawData = '';
        response.on("data", (chunk) => {
            rawData += chunk;
        });
        response.on("end", () => {
            try {
                const parsedData = JSON.parse(rawData);
                data = parsedData
            } catch (e) {
                console.log(e);
            }
        })
    })
})

router.get("/getanime", (req, res) => {
    res.send(data)
})

module.exports = router;