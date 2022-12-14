/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: _KHUSHWANT SINGH RAO_ Student ID: __145931192___ Date: ___2022-09-16___
* Cyclic Link: https://teal-nice-bee.cyclic.app/
********************************************************************************/ 

const express = require("express");
const cors = require("cors");
const app = express();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
require('dotenv').config();
app.use(express.json());

app.get('/',(req,res)=>{
    res.json({message: "API Listening!"});
});

// ADD NEW MOVIE
app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body).then(()=>{
        res.status(201).json(newMovie);
    }).catch((err)=>{
        res.status(500).json({message: err});
      });
  });

//GET MOVIES PER PAGE BY OPTION FILTERS
app.get('/api/movies',(req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => { res.status(500).json({ error: err.message }) });
  });

//GET MOVIE BY ID
app.get('/api/movies/:id',(req, res) => {
    db.getMovieById(req.params.id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => { res.status(500).json({ error: err.message }) });
    });

//DELETE MOVIE BY ID
app.delete('/api/movies/:id',(req,res)=>{
    db.deleteMovieById(req.params.id).then(()=>{
        res.status(201).json({Message: "Movie Deleted!"});
    }).catch((err)=>{
        res.status(500).json({Message: err + "Invalid ID!"});
    })
});

//UPDATE MOVIE BY ID
app.put('/api/movies/:id',async (req, res) => {
    try{
        await db.updateMovieById(req.body, req.params.id);
        res.json({message: "Movie Updated!"});
      }catch(err){
        res.status(500).json({message: err});
      }
  });

//INITIALIZE
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
   });