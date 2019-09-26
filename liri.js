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
        choices: ["Find Concerts", "Spotify this Song", "Movie Information", "do-what-it-says", "Exit"],
        name: "choice"
      }
    ])
      .then( res => {
        // console.log(res)
        switch(res.choice) {
          case "Find Concerts":
            concerts();
            break;
          case "Spotify this Song":
            songSearch();
            break;
          case "Movie Information":
            movieSearch();
            break;
          case "do-what-it-says":
            doWhatItSays();
            break;
          case "Exoit":
            return;
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

var searchTopic = "";
var goAgain = function() {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: `Would you like to search for another ${searchTopic}?`,
        name: "confirm"
        
      }
    ])
      .then( res => {
        if (res.confirm){
          switch(searchTopic){
            case "artist":
              concerts();
              break;
            case "song":
              songSearch();
              break;
            case "movie":
              movieSearch();
              break;
          }
        } else {
          backToMenu();
        }
      })
};

// ---- bandsintown - CONCERT SEARCH ---- //
var concerts = function() {
  searchTopic = "artist";
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
        if (artist === ""){
          backToMenu();
          return;
        }
        axios
          .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
            .then( res => {
              const info = res.data;
              if (info.length < 1){
                console.log('\n------------N-O--C-O-N-C-E-R-T-S--F-O-U-N-D------------\n')
                goAgain();
              }
              console.log(`Events for "${artist}"`)
              console.log('\n-------------------------------------------------------\n')
              for (let i = 0; i < info.length; i++) {
                console.log(`Venue: ${info[i].venue.name}`);
                console.log(`Location: ${info[i].venue.city}, ${info[i].venue.region} ${info[i].venue.country}`);
                console.log(`Time: ${moment(info[i].date).format("dddd, MMMM Do YYYY, h:mm a")}`)
                console.log('\n-------------------------------------------------------\n')
              }
              goAgain();
            })
            .catch( err => {
              console.log(err);
            })
      })
};

// ---- Spotify - SONG SEARCH ---- //
var songSearch = function() {
  searchTopic = "song";
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
              goAgain();
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
                if (res.tracks.items.length < 1){
                  console.log('\n------------N-O--S-O-N-G-S--F-O-U-N-D------------\n')
                  goAgain();
                }
                console.log('\n------------------------------------------------------------------------------------\n')
                for (let i = 0; i < res.tracks.items.length; i++){
                  var song = res.tracks.items[i];
                  displaySongInfo(song);
                  console.log('\n------------------------------------------------------------------------------------\n')
                }
                goAgain();
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

// ---- OMDb - MOVIE SEARCH ---- //
var movieSearch = function() {
  searchTopic = "movie";
  inquirer
    .prompt([
      {
        message: "What movie would you like to look up on OMDb?",
        name: "movie"
      }
    ])
      .then( res => {
        const movie = res.movie.trim();
        if (movie === ""){
          backToMenu();
          return;
        }
        axios
          .get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`)
            .then( res => {
              var data = res.data;
              // console.log(JSON.stringify(res.data, null, 2))
              // console.log(JSON.stringify(data.Response, null, 2))
              if (data.Response === "False"){
                console.log(data.Error)
                goAgain();
                return;
              }
              console.log('==============================================================')
              console.log(`\nMovie Title: "${data.Title}"\n`);
              console.log(`Release Year: ${data.Year}\n`);
              console.log(`${data.Ratings[0].Source} Rating: ${data.Ratings[0].Value}\n`);
              console.log(`${data.Ratings[1].Source} Rating: ${data.Ratings[2].Value}\n`);
              console.log(`Country of Production: ${data.Country}\n`);
              console.log(`Language: ${data.Language}\n`);
              console.log(`Plot Summary:\n${data.Plot}\n`);
              console.log(`Actors:${data.Actors}\n`);
              console.log('==============================================================')
              goAgain();
            })
            .catch( err => {
              console.log(err);
            })
      })
};

// ---- do-what-it-says - fs ReadFile + Spotify ---- //
// this is gross copy&paste code from above
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if(error){
      return console.log(error);
    }

    var newData = data.split(',')

    switch(newData[0]) {
      case "concert-this":
          searchTopic = "artist";
          const artist = newData[1].trim().split('"')
          if (artist === ""){
            backToMenu();
            return;
          }
          axios
            .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
              .then( res => {
                const info = res.data;
                if (info.length < 1){
                  console.log('\n------------N-O--C-O-N-C-E-R-T-S--F-O-U-N-D------------\n')
                  goAgain();
                }
                console.log(`Events for "${artist}"`)
                console.log('\n-------------------------------------------------------\n')
                for (let i = 0; i < info.length; i++) {
                  console.log(`Venue: ${info[i].venue.name}`);
                  console.log(`Location: ${info[i].venue.city}, ${info[i].venue.region} ${info[i].venue.country}`);
                  console.log(`Time: ${moment(info[i].date).format("dddd, MMMM Do YYYY, h:mm a")}`)
                  console.log('\n-------------------------------------------------------\n')
                }
                goAgain();
              })
              .catch( err => {
                console.log(err);
              })
        break;

      case "spotify-this-song":
          searchTopic = "song";
          spotify
          .search(
            {
              type: 'track',
              query: newData[1].trim().split('"'),
              limit: 10
            }
          )
            .then( res => {
              if (res.tracks.items.length < 1){
                console.log('\n------------N-O--S-O-N-G-S--F-O-U-N-D------------\n')
                goAgain();
              }
              console.log('\n------------------------------------------------------------------------------------\n')
              for (let i = 0; i < res.tracks.items.length; i++){
                var song = res.tracks.items[i];
                displaySongInfo(song);
                console.log('\n------------------------------------------------------------------------------------\n')
              }
              goAgain();
            })
            .catch( err => {
              console.log(err);
            })
        break;

      case "movie-this":
          searchTopic = "movie";
          const movie = newData[1].trim().split('"');
          if (movie === ""){
            backToMenu();
            return;
          }
          axios
            .get(`http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=trilogy`)
              .then( res => {
                var data = res.data;
                // console.log(JSON.stringify(res.data, null, 2))
                // console.log(JSON.stringify(data.Response, null, 2))
                if (data.Response === "False"){
                  console.log(data.Error)
                  goAgain();
                  return;
                }
                console.log('==============================================================')
                console.log(`\nMovie Title: "${data.Title}"\n`);
                console.log(`Release Year: ${data.Year}\n`);
                console.log(`${data.Ratings[0].Source} Rating: ${data.Ratings[0].Value}\n`);
                console.log(`${data.Ratings[1].Source} Rating: ${data.Ratings[2].Value}\n`);
                console.log(`Country of Production: ${data.Country}\n`);
                console.log(`Language: ${data.Language}\n`);
                console.log(`Plot Summary:\n${data.Plot}\n`);
                console.log(`Actors:${data.Actors}\n`);
                console.log('==============================================================')
                goAgain();
              })
              .catch( err => {
                console.log(err);
              })
        break;
    }
    
  });
};