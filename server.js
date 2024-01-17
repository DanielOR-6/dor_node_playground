const users = require("./api/users");

const express = require("express");
const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/users", users);

app.listen(PORT, async () => {
   console.log("Server started on port 5000");
});