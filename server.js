const express = require('express');
const app = express();

const PORT = 5000;

app.get('/', (req,res)=>{
    res.send("Welcome to the session")
})

app.listen(PORT, ()=>{
    console.log(`server is listning on the port ${PORT}`)
})