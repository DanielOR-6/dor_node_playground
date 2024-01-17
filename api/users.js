const express = require("express");
const router = express.Router();

const { MongoClient } = require("mongodb");
const mongoUrl = require("../config");

let client;
let mongoDb;

router.use(async (req, res, next) => {
   client = new MongoClient(mongoUrl);
   await client.connect();
   mongoDb = client.db("react_project");
   next()
})

router.post("/signup", async (req, res) => {
   const mongoCollection = mongoDb.collection("users");

   const userData = req.body;

   const userExists = await mongoCollection.findOne({
      email: userData.email, 
   });

   console.log("Exists", userExists, "\n", "Data", userData);

   // To control google sign in / log in ...
   if (userExists) {
      if (client) await client.close();
      res.status(200).json({message: "User already exists!"});
   } else {
      
      const result = await mongoCollection.insertOne(userData);

      if (client) await client.close();

      if (result) {
         res.status(200).json({message: "User created succesfully!"});
      } else {
         res.status(400).json({message: "Error creating user"});
      }
   }
});

module.exports = router;