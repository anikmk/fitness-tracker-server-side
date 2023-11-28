const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@anik.34iapyi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userCollection = client.db("fitnessDb").collection("users");
    const reviewsCollection = client.db("fitnessDb").collection("reviews");
    const trainerCollection = client.db("fitnessDb").collection("trainer");
    const newsLatterCollection = client.db("fitnessDb").collection("newsLatter");
    const entryClassCollection = client.db("fitnessDb").collection("entryClass");
    const entryForumCollection = client.db("fitnessDb").collection("entryForum");

    // user related api
    app.get('/users',async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    app.post('/users',async(req,res)=>{
      const user = req.body;
      const query = {email: user.email};
      const axistingUser = await userCollection.findOne(query);
      if(axistingUser){
        return res.send({message:'user already axist',insertedId:null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // app.patch('/users/admin/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)}
    //   const updatedDoc = {
    //     $set: {
    //       role:'admin'
    //     }
    //   }
    //   const result = await userCollection.updateOne(filter,updatedDoc);
    //   res.send(result);
    // })
    // Check if a user has admin role route
    app.get("/users/:email", async (req, res) => {
      try {
        const userEmail = req.params.email;
    
        const user = await userCollection.findOne({ email: userEmail });
    
        if (!user) {
          return res.status(404).send({ error: "User not found" });
        }
    
        const userRole = user.role || "user"; // Assuming 'role' is a string property in the user object
        const isAdmin = userRole === "admin";
        const isCoach = userRole === "trainer";
    
        res.status(200).send({ email: userEmail, isAdmin, isCoach });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // entry class related api
    app.get('/entryclass',async(req,res)=>{
        const result = await entryClassCollection.find().toArray();
        res.send(result);
    })
    app.get('/entryclass/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await entryClassCollection.findOne(query);
      res.send(result);
    })
    app.post('/entryclass',async(req,res)=>{
        const entryClassInfo = req.body;
        const result = await entryClassCollection.insertOne(entryClassInfo);
        res.send(result);
    })
    // entry forum related api
    app.get('/entryforum',async(req,res)=>{
      const result = await entryForumCollection.find().toArray();
      res.send(result);
    })
    app.post('/entryforum',async(req,res)=>{
      const entryForumInfo = req.body;
      const result = await entryForumCollection.insertOne(entryForumInfo);
      res.send(result);
    })
    app.patch('/entryforum/:id',async(req,res)=>{
      const item = req.body;
      const currentLike = item.like + 1;
      const currentDislike = item.dislike + 1;
      console.log(item)
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const option = { upsert: true };
      const updatedDoc = {
        $set:{
          like:currentLike,
          dislike:currentDislike
        }}
        const result = await entryForumCollection.updateOne( filter, updatedDoc,option)
        res.send(result);
      })
    
    // trainer releted apis
    app.get('/trainer',async(req,res)=>{
        const result = await trainerCollection.find().toArray();
        res.send(result);
    })
    app.get('/trainer/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await trainerCollection.findOne(query);
        res.send(result);
    });
    app.post('/trainer',async(req,res)=>{
        const trainerInfo = req.body;
        const result = await trainerCollection.insertOne(trainerInfo);
        res.send(result);
    })
    // reviews releted api
    app.get('/reviews',async(req,res) => {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })
    // news latter related api
    app.get('/newslatter',async(req,res)=>{
      const result = await newsLatterCollection.find().toArray();
      res.send(result);
    })
    app.post('/newslatter',async(req,res)=>{
        const NewsLatterInfo = req.body;
        const result = await newsLatterCollection.insertOne(NewsLatterInfo);
        res.send(result); 
    })
    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('fitness tracker is running')
})
app.listen(port,()=>{
    console.log(`fitness tracker is running on port: ${port}`)
})