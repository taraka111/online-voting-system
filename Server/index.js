
const express = require('express')
const cors = require('cors')
const {MongoClient, ObjectId} = require('mongodb')

const app=express()
app.use(cors())
app.use(express.json())
const client = new MongoClient('mongodb+srv://admin:admin@cluster0.e2ojb9t.mongodb.net/?retryWrites=true&w=majority')
client.connect()
const db = client.db('counselling1')
const col = db.collection('Register')
//col.insertOne({'student':"123"})

app.post('/register', async (req, res) => {
    try {
        await col.insertOne(req.body);
        res.send('inserted successfully');
    } catch (error) {
        console.error('Error occurred during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/retrieve',async (req,res)=>{
    const result = await col.find().toArray()
    console.log(result)
    res.send(result)
})

app.put('/users/:id',async(req,res)=>{
    const {id}=req.params
    const{name,role,email,password}=req.body
    const result=col.updateOne({_id: new ObjectId(id)},
    {$set:{name,role,email,password}})
    res.send('updated')
})
app.delete('/users/:id',async(req,res)=>{
    const {id}=req.params
    const result=await col.deleteOne({_id:new ObjectId(id)})
    res.json({message:"deleted successfully"})
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await col.findOne({ email });
    if (!user || !(password === user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({username: user.name})
    console.log(user.email, user.password, password); 
    
})


app.get('/',(req,res)=>{
    res.send('<h1><center>Hello World</center></h1>')
})
app.get('/about',(req,res)=>{
    res.send('<h1><center>This is about page</center></h1>')
})
app.listen('8080', ()=>{
    console.log('server is running')
})
