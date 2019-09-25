require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var inquirer = require("inquirer");
var bandsintown = require("bandsintown");
var moment = require('moment');
moment().format();