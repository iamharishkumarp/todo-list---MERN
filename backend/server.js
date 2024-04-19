//Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// creating an instance of express
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());


// Sample in-memory storage for todo items
// let todos = [];


// connecting mongodb
mongoose.connect('mongodb://localhost:27017/todo-app')
.then(()=>{
    console.log("DataBase has successfully Connected.")
})
.catch((err) => {
    console.log(err)
})

// creating scheme 
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

// creating model
const todoModel = new mongoose.model('Todo', todoSchema);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create a new TODO Item
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };

    // todos.push(newTodo);
    // console.log(todos);
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }

});

// Get all items
app.get('/todos', async (req, res)=> {
    try {
        const todos = await todoModel.find();
        res.json(todos);

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})


// update a todo list
app.put("/todos/:id", async (req, res)=>{
    try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id, 
        {title, description},
        {new : true}
    )

    if (!updatedTodo){
        return res.status(404).json({message: "Todo not found"});
    }
    res.json(updatedTodo);

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

//deleting an todo item
app.delete('/todos/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

//Starting the server
const port = 8000;
app.listen(port, ()=>{
    console.log("Server is listening to port: "+port);
})