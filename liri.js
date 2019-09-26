require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");
// var bandsintown = require("bandsintown");
var moment = require('moment');
// moment().format();

// ---- MAIN MENU ---- //
var menu = function() {
  inquirer
    .prompt([
      {
        message: "\tThank you for Using LIRI! What can I help you with?",
        type: "list",
        choices: ["Find Concerts", "Spotify This Song", "Movie Information", "do-what-it-says"],
        name: "choice"
      }
    ])
      .then( res => {
        console.log(res)
        switch(res.choice) {
          case "Find Concerts":
            concerts();
            break;
          case "Spotify This Song":
            songSearch();
            break;
          case "Movie Information":
            movieSearch();
            break;
          case "do-what-it-says":
            console.log('what say do????!?!?');
            break;
        }
      });
};

menu();

var backToMenu = function() {
  inquirer
  .prompt([
    {
      type: "confirm",
      message: "Back to Main Menu?",
      name: "confirm"
    }
  ])
    .then( res => {
      if (res.confirm){
        menu();
      } else{
        return;
      }
    })
};

// ---- bandsintown - CONCERT SEARCH ---- //
var concerts = function() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What band or artist are you looking for?",
        name: "artist"
      }
    ])
      .then ( res => {
        const artist = res.artist.trim()
        axios
          .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
            .then( res => {
              const info = res.data;
              if (info.length < 1){
                console.log('\n------------N-O--C-O-N-C-E-R-T-S--F-O-U-N-D------------\n')
                concertsAgain();
              }
              console.log(`Events for "${artist}"`)
              console.log('\n-------------------------------------------------------\n')
              for (let i = 0; i < info.length; i++) {
                console.log(`Venue: ${info[i].venue.name}`);
                console.log(`Location: ${info[i].venue.city}, ${info[i].venue.region} ${info[i].venue.country}`);
                console.log(`Time: ${moment(info[i].date).format("dddd, MMMM Do YYYY, h:mm a")}`)
                console.log('\n-------------------------------------------------------\n')
              }
              concertsAgain();
            })
            .catch( err => {
              console.log(err);
            })
      })
};

var concertsAgain = function() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to search for another artist?",
        name: "confirm"
        
      }
    ])
      .then( res => {
        if (res.confirm){
          concerts();
        } else {
          backToMenu();
        }
      })
};

// ---- Spotify - SONG SEARCH ---- //
var songSearch = function() {
  inquirer
    .prompt([
      {
        message: "What song would you like to look up on Spotify?",
        name: "song"
      }
    ])
      .then( res => {
        var song = res.song.trim();
        if (song === ""){
          spotify
            .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
              .then( res => {
              displaySongInfo(res);
              })
              .catch( err => {
                console.log(err);
              });
        } else {
          spotify
            .search(
              {
                type: 'track',
                query: song,
                limit: 10
              }
            )
              .then( res => {
                console.log('\n------------------------------------------------------------------------------------\n')
                for (let i = 0; i < res.tracks.items.length; i++){
                  var song = res.tracks.items[i];
                  displaySongInfo(song);
                  console.log('\n------------------------------------------------------------------------------------\n')
                }
                songAgain();
              })
              .catch( err => {
                console.log(err);
              })
        }
      })
};

var displaySongInfo = function(data) {
  console.log(`Artist: ${data.artists[0].name}`)
  console.log(`Song: "${data.name}"`)
  console.log(`Album: ${data.album.name}`)
  console.log(`Preview URL: \n\t${data.preview_url}`)
};

var songAgain = function() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: "Would you like to search for another song?",
        name: "confirm"
        
      }
    ])
      .then( res => {
        if (res.confirm){
          songSearch();
        } else {
          backToMenu();
        }
      })
};

// ---- OMDb - MOVIE SEARCH ---- //

var movieSearch = function() {

};