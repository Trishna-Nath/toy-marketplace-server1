const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASSWORD)


// const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rxo9yaa.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://trishna:CUq1QiIAUZC0ZvUO@cluster0.tlvanpb.mongodb.net/?retryWrites=true&w=majority`;

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

    app.get('/jwt' , (req,res) =>{
      const user= req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ 
        expiresIn: '1h'})
        res.send(token);
    })


    const sweetCollection = client.db('toyMarket1').collection('sweet');

    app.get('/sweet', async(req,res) =>{

      const query = {};
      const cursor = sweetCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/sweet/:id', async(req,res) =>{
      const id = res.params.id;
     const query = { _id:new ObjectId(id) }

     const options = {
      // Include only the `title` and `imdb` fields in each returned document
      projection: {  title: 1, name: 1, name: 1 },
    };


     const result = await sweetCollection.findOne(query, options);
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




app.get('/', (req, res) => {
    res.send('toy marketplace is running')
})

app.listen(port, () => {
    console.log(`toy marketplace server is running on port ${port}`)
})