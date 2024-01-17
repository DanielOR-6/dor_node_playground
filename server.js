const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 5000;

const mongoUrl = require("./config");

app.get("/api", (req, res) => {
   res.json({"users": ["one", "two", "three", "four"]})
});

app.use(express.json());

app.post("/user/signup", async (req, res) => {
   const userData = req.body;

   const client = new MongoClient(mongoUrl);

   await client.connect();

   const mongoDb = client.db("react_project");
   const mongoCollection = mongoDb.collection("users");

   const userExists = await mongoCollection.findOne({
      _id: userData._id, 
   });

   console.log(userExists);

   if (userExists) {
      await client.close();
      res.status(200).json({message: "User already exists!"});
   } else {
      
      const result = await mongoCollection.insertOne(userData);

      await client.close();

      if (result) {
         res.status(200).json({message: "User created succesfully!"});
      } else {
         res.status(400).json({message: "Error creating user"});
      }
   }
});

app.listen(PORT, () => {
   console.log("Server started on port 5000");
});