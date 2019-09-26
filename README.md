# LIRI Bot
This program is meant to be run on a command-line and has been constructed as part of an exercise exploring the usage NODE-js and integrating three different API technologies into a functioning app.
[Project on GitHub](https://github.com/andrew-jolivette/liri-node-app)

## Technologies Utilized
* [bandsintown](https://www.npmjs.com/package/bandsintown)
* [node-spotify-api](https://www.npmjs.com/package/node-spotify-api)
* [OMBd-api](http://www.omdbapi.com/)
* [axios](https://www.npmjs.com/package/axios)
* [inquirer](https://www.npmjs.com/package/inquirer)
* [moment](https://www.npmjs.com/package/moment)
* [dotenv](https://www.npmjs.com/package/dotenv)

## Installation Instructions
Make sure you have npm working and run in command-line in the downloaded directory to install the app dependancies:
```
npm install
```

**Next** the Spotify API requires you sign up as a developer to generate the necessary credentials. Generate a **client id** and **client secret** and create a file named `.env`, add the following to it, replacing the values with your API keys (no quotes) once you have them:

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

```

### Running Program
Navigate to your where you downloaded the program in the CLI and type:
```
node liri.js
```
If you want to switch the commands in `random.txt` make sure the to only use the following inputs before the first comma:

* concert-this
* spotify-this-song
* movie-this

Followed by what you want to search after the comma. Unfortunately, at this time this wont let you input multiple commands.

## Overview
This project utilizes `inquirer` to navigate through a prompt-based menu system allowing them to choose between looking up an artist/band and finding concert dates and locations, searching for a song on spotify and lastly looking up a movie and getting back that movie's information.

### Implimentation
I have implimented ways to cycle back through the menu system as well as accounting for issues that might come up with blank user enteries, extra spaces as well as zero query returns.  I found that `inquirer` is incredibly useful for user accessibility.  The main challenge I had was structuring the menu system as well as creating some dynamic response such as under the goAgain function.