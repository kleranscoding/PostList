/**
 * server.js
 * PostList
 * Author: Clarence
 */

/////***** ===== VARIABLES ===== *****/////

const portNum= 8000;
const express= require('express');
const app= express();
const bodyParser= require('body-parser');
const db= require('./models');


/////***** ===== MIDDLEWARE ===== *****/////

app.use(express.json());
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));


/////***** ===== VIEWS ===== *****/////

app.get('/',(req, res)=> {
    res.sendFile(__dirname+'/views/index.html');
});


/////***** ===== PORT LISTENING ===== *****/////

app.listen(process.env.PORT || portNum);

