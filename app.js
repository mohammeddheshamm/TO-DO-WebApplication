const express = require('express');
const Task = require('./models/Task');
const app = express();
const PORT = 5000 || process.env.PORT;
// const connection = require('./database/dbConnection');
const mongoose =  require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('MongoDB Connected Successfully');
    }).catch((err)=>{
        console.log('failed to connect to MongoDb ',err);
    });



// Getting or retriving all tasks from database.
app.get('/Tasks',async (req,res)=>{
    try{
        const Tasks = await Task.find();
        res.status(200).json(Tasks);
    }catch(err){
        res.status(500).json(err);
    }
})

// Creating a task.
app.post('/Tasks',async (req,res)=>{
    try{
        const newTask = new Task();
        newTask.title = req.body.taskTitle;
        newTask.description = req.body.taskDescription;
        newTask.done = req.body.taskDone;
        await newTask.save();
        res.status(200).json(newTask);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }

});

// Getting a speciific task by id
app.get("/Tasks/:taskId", async (req,res)=>{
    try{
        const id = req.params.taskId;
        const task = await Task.findById(id);
        if (!task) 
            throw new Error("Task is not found");
        res.status(200).json(task);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Deleting a specific task by id
app.delete("/Tasks/:taskId", async (req,res)=>{
    try{    
        const id = req.params.taskId;
        const task = await Task.findByIdAndDelete(id);
        if(!task)
            throw new Error("Task is not found");
        res.status(200).json(task);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Updating a specific task didn't work 
app.put("/Tasks",async (req,res) =>{
     try{
        const taskId = req.body.taskId;
        let doc = await Task.findById(taskId);
        doc.title = req.body.taskTitle;
        doc.description = req.body.taskDescription;
        doc.done = req.body.taskDone;
        await doc.save();
        res.status(200).json(doc);
     }catch(err){
        console.log(err);
        res.status(500);
     }    
});

// $set: {
//     plot: `A harvest of random numbers, such as: ${Math.random()}`
//   },

app.listen(PORT,()=>{
    console.log(`Listening to Port ${PORT}`);
});