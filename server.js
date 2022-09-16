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
app.post('/api/movies', async (req, res) => {
    try{
    const newMovie = await db.addNewMovie(req.body); 
    res.status(201).json(newMovie);
    }catch(err){
        res.status(500).json({message: err});
      };
  });

//GET MOVIES PER PAGE BY OPTION FILTERS
app.get('/api/movies',async (req, res) => {
    try{
       const data = await db.getAllMovies(req.query.page, req.query.perPage, req.query.title);
        res.json(data);
    }
    catch(err){
        res.status(500).json({message: err});
    }
  });

//GET MOVIE BY ID
app.get('/api/movies/:id', async (req, res) => {
    try{
        const data = await db.getMovieById(req.params.id); 
        if(data){
            res.status(201).json(data);
        }
        res.send("Not Found!");
      }catch(err){
        res.status(500).json({message: err});
      }  });

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