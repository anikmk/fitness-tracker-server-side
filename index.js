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
    const reviewsCollection = client.db("fitnessDb").collection("reviews");
    const trainerCollection = client.db("fitnessDb").collection("trainer");
    const newsLatterCollection = client.db("fitnessDb").collection("newsLatter");

    // trainer releted apis
    app.get('/trainer',async(req,res)=>{
        const result = await trainerCollection.find().toArray();
        res.send(result);
    })
    app.get('/trainer/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        console.log(query)
        const result = await trainerCollection.findOne(query);
        res.send(result);
    });
    // reviews releted api
    app.get('/reviews',async(req,res) => {
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })
    // news latter related api
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