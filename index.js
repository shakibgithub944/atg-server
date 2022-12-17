const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ofvswtt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const UserCollection = client.db("atg-world").collection("users");
        const PostCollection = client.db("atg-world").collection("posts");
        const LikeCollection = client.db("atg-world").collection("likes");
        const CommentsCollection = client.db("atg-world").collection("comments");

        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await UserCollection.insertOne(user);
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const name = req.query.name;
            const password = req.query.password;
            const query = { name, password }
            const user = await UserCollection.findOne(query);
            if (!user) {
                return res.status(403).send('Request forbidden')
            }
            res.send(user)
        })

        app.get('/email/:email', async (req, res) => {
            const email = req.params.email
            const query = { email }
            const result = await UserCollection.findOne(query);
            if (!result) {
                return res.status(403).send('Request forbidden')
            }
            res.send(result);
        })

        app.put('/password/:email', async (req, res) => {
            const email = req.params.email;
            const password = req.query.password;
            const query = { email }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    password: password,
                }
            }
            const result = await UserCollection.updateOne(query, updatedDoc, options);
            res.send(result)
        })

        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await PostCollection.insertOne(post);
            res.send(result)
        })
        
        
        app.get('/posts', async (req, res) => {
            const query = {}
            const result = await PostCollection.find(query).toArray();
            res.send(result)
        })
   



    }
    finally {

    }
}
run().catch(error => console.log(error))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})