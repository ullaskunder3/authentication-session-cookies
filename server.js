const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 5000;

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
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