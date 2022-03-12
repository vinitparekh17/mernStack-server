
const express = require("express");
const mongoose = require("mongoose");
const Form = require("./models/form");
const app = express();;

require("dotenv").config();;
mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Mongoose connected"))
    .catch(e => console.log(e))

app.use(express.json())
app.use(require("./auth"))
app.listen(5000, () => console.log("server is ready on port 5000"))