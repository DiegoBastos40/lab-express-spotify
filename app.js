require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi= require('spotify-web-api-node') ;

// require spotify-web-api-node package here:
const app = express();


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


//CREDENTIALS

const spotifyApi=  new SpotifyWebApi ( { 
clientId : process.env.CLIENT_ID , clientSecret: process.env.CLIENT_SECRET } ) ;



  spotifyApi 
  .clientCredentialsGrant () 
  .then(data=>spotifyApi.setAccessToken(data.body [ 'access_token' ] ) ) 
  .catch( erro=>  console.log ( ' Algo deu errado ao recuperar um token de acesso' , erro ) ) ; 


// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home');
  });
  
  app.get('/artist-search', (req, res, next) => {

    
         spotifyApi.searchArtists(req.query.artist)
      .then(data=> {
          console.log(data.body.artists.items);
        res.render('artist-search-results', {
            data:data.body.artists.items
        });
       
      }),(err => 
        console.log('Something went wrong!', err)); 
      
  });

  app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then (data => {
       res.render('albums',{
           albums:data.body.items
       });
    }),(err => 
        console.log('Something went wrong!', err)); 
      
  });
  app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data=>{
        
       res.render('tracks',{
           tracks:data.body.items
       });
       
    }),(err => 
        console.log('Something went wrong!', err)); 
      
  });
    
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
