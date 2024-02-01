const express = require('express');
const router = require('./app/routes/routes');
// const mongoose = require("mongoose")
// const { MongoClient } = require('mongodb');
const { connectToMongoDB } = require('./app/databaseSetup'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up the database
connectToMongoDB(); 

//to let the frontend access all the static files
// app.use(express.static(path.join(__dirname +'/public')))
app.use(express.static(__dirname +'/public'))

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

// const corsOptions = {
//   origin: 'http://localhost:4200', // origin for your Angular app 
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));
// app.get('/', (req, res) => {
//   return res.send('Received a GET HTTP method');
// redirect("/api")
// });


//no matter what the user types it will sent this index.html file
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname+'/public/app/views/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


