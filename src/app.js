const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//Defines path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and view location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res)=>{
    res.render('index', {
        title: "Weather",
        name: 'Nirav Patel'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Nirav Patel'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Nirav Patel',
        helpText: 'This is help Page.'
    });
});

app.get('/weather', (req, res) => {

    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!'
        });
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({
                error: error
            });
        }

        forecast(latitude, longitude, (error, forecastData)=>{
           if(error){
               return res.send({
                error: error
            });
           }
           
           res.send({
               location: location,
               forecast: forecastData,
               address: req.query.address,
           });
        });  
        
    });
});

app.get('/help/*', (req, res) => {
    res.render('404',{
        title: 'Error 404',
        name: 'Nirav Patel',
        errorMessage: 'Help Article not found'
    });
});

app.get('*', (req, res) => {
    res.render('404',{
        title: 'Error 404',
        name: 'Nirav Patel',
        errorMessage: 'Page Not Found.'
    });
});

app.listen(3000, ()=>{
    console.log('Server is up on localhost:3000');
});