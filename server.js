/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: _KHUSHWANT SINGH RAO_ Student ID: __145931192___ Date: ___2022-09-16___
* Cyclic Link: https://teal-nice-bee.cyclic.app/
********************************************************************************/ 

const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
const cors = require('cors')
const MoviesDB = require("./modules/moviesDB.js");
const { json } = require('express');
const db = new MoviesDB();
require('dotenv').config()

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`server listening on: ${PORT}`);
    })
}).catch((err) => {
    console.log(err);
});

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.json({ message: "API Listening" })
})

app.post('/api/movies', (req, res) => {
    if (Object.keys(req.body) === 0)
        res.status(500).json({ message: "missing body" })
    else
        db.addNewMovie(req.body)
            .then((data) => { res.status(200).json(data) })
            .cathch((err) => { res.status(500).json({ error: err.message }) })
})

app.get('/api/movies', (req, res) => {
    if (!req.query.page || !req.query.perPage)
        res.status(500).json({ message: "missing query page/perPage" })
    else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
            .then((data) => {
                if (data.length === 0) res.status(204).json({ message: "no data found" })
                else res.json(data)
            })
            .catch((err) => { res.status(500).json({ error: err.message }) })

    }
})

app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id)
        .then((data) => {
            if (data.length === 0) res.status(204).json({ message: "no data found" })
            else res.json(data)
        })
        .catch((error) => { res.status(500).json({ error: err.message }) })
})

app.put('/api/movie', (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(500).json({ message: "empty body" })
    else
        db.updateMovieById(req.body, req.params._id)
            .then(() => { res.status(201).json({ message: "update successfully" }) })
            .catch((err) => { res.status(500).json({ error: err.message }) })
})

app.delete('/api/movies', (req, res) => {
    db.deleteMovieById(req.params._id)
        .then(() => { res.status(201).json({ message: "data deleted" }) })
        .catch((err) => { res.status(500).json({ error: err.message }) })
})