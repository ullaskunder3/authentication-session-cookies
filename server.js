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

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/src'))
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.get('/landing', (req,res)=>{
    res.render('landing');
})
app.get('/login', (req,res)=>{
    res.render('login');
})
app.post('/login', (req,res)=>{})
app.get('/register', (req,res)=>{
    res.render('register');
})
app.post('/register', (req,res)=>{})
app.get('/profile', (req,res)=>{
    res.render('profile')
})

app.listen(PORT, ()=>{
    console.log(`server is listning on the port ${PORT}`)
})