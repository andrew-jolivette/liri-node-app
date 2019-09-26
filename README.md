# LIRI
This program is meant to be run on a command-line and has been constructed as part of an exercise exploring the usage NODEjs and integrating three different API technologies into a functioning app.

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