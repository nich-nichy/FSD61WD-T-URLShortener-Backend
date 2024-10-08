const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const shortnerRoute = require("./routes/shortner.route");
require("dotenv").config();

const { MONGO_URL, PORT, APP_URL } = process.env;
const port = PORT || 8081;
const app = express();

app.use(
    cors({
        origin: APP_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

mongoose.connect(MONGO_URL, {})
    .then(() => console.log("MongoDB is connected successfully"))
    .catch((err) => console.error(err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use("/", shortnerRoute);

app.get("/status", (req, res) => {
    res.send(`Backend for app is running on ${port}`);
});

// Error handling
app.use((req, res, next) => {
    const error = {
        status: 404,
        message: "Check route and method",
    };
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log("ERROR", error);
    res.json({
        error: {
            message: error.message,
            status: error.status,
        },
    });
});