const express = require('express');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/sessions', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('Mongodb is connected...')
}).catch(error =>{
    console.log('Failed to connect', error)
})
const store = new mongodbSession({
    uri: 'mongodb://localhost:27017/sessions',
    collection: 'currentSession'
})

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.get('/', (req,res)=>{
    req.session.isAuth = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send("Welcome to the session")
})

app.listen(PORT, ()=>{
    console.log(`server is listning on the port ${PORT}`)
})