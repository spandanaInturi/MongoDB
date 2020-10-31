const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose  = require('mongoose');
const cors = require('cors');
const budgetModel = require('./models/budgetModel');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var url = 'mongodb://localhost:27017/budget-data';
app.use('',express.static('public'));
app.use(cors());

app.get('/hello',(req,res)=>{
    res.send("sample text");    
});

//var sampleData = require('./sampleData.json');
app.get('/budget',(req,res)=>{
    //console.log(sampleData);
    //res.json(sampleData);    
    // budgetModel.find({}).then((data) =>{
    //     console.log(data);
    //     res.status(200).send(data);
    // }).catch((error)=>{
    //     console.log(error);
    //     res.status(500).send();
    // })
    mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
            .then(()=>{
                console.log("Connection to the database is established");
                budgetModel.find({})
                           .then((data)=>{
                               console.log(data);
                               res.status(200).send(data);
                               mongoose.connection.close();
                           })
                           .catch((err)=>{
                               console.log(err);
                               res.status(500).send();
                           })
            })
})


// new post route to simulate data addition
app.post('/budget',(req,res)=>{
    console.log("inside post");
    console.log(req.body);
    let data = {id: req.body._id, title: req.body.title, budget: req.body.budget, color: req.body.color}
    mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})
            .then(()=>{
                console.log("Connection to the database is established");
                budgetModel.insertMany(data,(err,data)=>{
                    if(err){
                        console.log(err);      
                        res.send(err);
                        mongoose.connection.close();
                    }else{
                        console.log("insert successful"); 
                        res.send(data);    
                        mongoose.disconnect();
                    }                    
                })                              
})
});

app.listen(port,()=>{
    console.log("App is running on port "+port);
});