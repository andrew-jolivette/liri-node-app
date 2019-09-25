require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");
var bandsintown = require("bandsintown");
var moment = require('moment');
// moment().format();

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
          console.log('Concerts!')
          break;
        case "Spotify This Song":
          console.log("Songs!")
          break;
        case "Movie Information":
          console.log("movies!")
          break;
        case "do-what-it-says":
          console.log('what say do????!?!?')
          break;
      }
    });