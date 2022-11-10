const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const app= express();

dotenv.config({path:'./config.env'})
app.use(require('./router'))
app.set('view engine','pug')
app.use(express.static(path.join(__dirname,'public')));

app.listen(process.env.PORT||8000);