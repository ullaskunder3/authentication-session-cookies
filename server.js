const express = require('express');
const session = require('express-session');
const mongodbSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./models/User')

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

const isAuth = (req, res, next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }
}

app.get('/', (req, res)=>{
    res.redirect('/landing')
})

app.get('/landing', (req,res)=>{
    res.render('landing');
})
app.get('/login', (req,res)=>{
    res.render('login');
})
app.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email})
    if(!user){
        return res.redirect('/login')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.redirect('/login')
    }
    req.session.isAuth = true;
    res.redirect('/profile')
})
app.get('/register', (req,res)=>{
    res.render('register');
})
app.post('/register', async (req,res)=>{
    const {username, email, password} = req.body;

    let user = await userModel.findOne({email});
    if(user){
        return res.redirect('/register');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = new userModel({
        username,
        email,
        password: hashPassword
    })

    await user.save();
    res.redirect('/login')
})
app.get('/profile', isAuth, (req,res)=>{
    res.render('profile')
})

app.post('/logout', (req, res)=>{
    req.session.destroy(err =>{
        if (err) throw err;
        res.redirect('/')
    })
})

app.listen(PORT, ()=>{
    console.log(`server is listning on the port ${PORT}`)
})