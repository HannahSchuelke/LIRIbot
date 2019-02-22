// Dependancies at the top (anything with a require)
// Code required to import the keys.js file and store it in a variable
require("dotenv").config();
const Spotify = require("node-spotify-api");
var axios = require("axios");
var keys = require("./keys.js");
const moment = require("moment");
const fs = require("fs");

// Variable to access keys information 
var spotify = new Spotify(keys);

// OMDB API with a default parameter of my favorite movie within an if statement
async function movieSearch(movie) {

    if (!movie) {
        movie = "wizard of oz";
    }
    try {
        const thisBecomesTheDotThenInAsyncAwait = await axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy");
        console.log("The movie's rating is: " + thisBecomesTheDotThenInAsyncAwait.data.imdbRating);
        console.log("Title: " + thisBecomesTheDotThenInAsyncAwait.data.Title);
        console.log("Year: " + thisBecomesTheDotThenInAsyncAwait.data.Year);
        console.log("Rotten Tomatoes Rating: " + thisBecomesTheDotThenInAsyncAwait.data.Ratings[1].Value);
        console.log("Country: " + thisBecomesTheDotThenInAsyncAwait.data.Country);
        console.log("Language: " + thisBecomesTheDotThenInAsyncAwait.data.Language);
        console.log("Plot: " + thisBecomesTheDotThenInAsyncAwait.data.Plot);
        console.log("Actors: " + thisBecomesTheDotThenInAsyncAwait.data.Actors);
    }
    catch (error) {
        console.log("oh no! we got an error!, this is the error: ", error);
    }
}

// Bands in Town API:
async function searchBandsInTown(artist) {
    console.log("The artist you have searched is: " + artist);

    if (!artist) {
        artist = "deadmau5";
    }
    let bandInfo = await axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=oisacfioqwuuwfcenqou");
    bandInfo = bandInfo.data[0];
    console.log("Venue Name: " + bandInfo.venue.name);
    console.log("Location: " + bandInfo.venue.city + ", " + bandInfo.venue.country);
    console.log("Date of Next Event: " + moment(bandInfo.datetime).format(('MMMM Do YYYY, h:mm:ss a')));
}
// Spotify API
function spotifySearch(song) {

    if (!song) {
        song = "Clair De Lune";
    }
    spotify.search(
        {
            type: "track",
            query: song
        }, (err, data) => {
            if (err) {
                return console.log("Error! :", err);
            }
            const songInfo = data.tracks.items[0];
            console.log("Artist: " + songInfo.artists[0].name);
            console.log("Song: " + songInfo.name);
            console.log("Album: " + songInfo.album.name);
            console.log("Preview Link: " + songInfo.album.href);
        }
    )
}

// Function to test LIRI commands
function testLiriCommand() {
    // console.log("This worked!");
}

// Creating the Do-What-It-Says function
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", (error, data) => {
        if (error) {
            return console.log("Error: ", error);
        }
        let dataArray = data.split(",");
        let doArray = ["index 0", "index 1", ...dataArray];
        return start(doArray);
    })
}

// Trimming down our array to have more usuable, clean data
function start(processArgs) {
    let commandArray = processArgs.slice(2);
// Switch statement used for cleaner if/else block of code
    const userCommand = commandArray[0];
// Using the slice command again, in order to not have to use quotes for titles
// .join will turn the array into a string and join it by a space
    let searchItem = commandArray.slice(1).join(" ");
        switch (userCommand) {
            case "concert-this":
                return searchBandsInTown(searchItem);

            case "spotify-this-song":
                return spotifySearch(searchItem);

            case "movie-this":
                return movieSearch(searchItem);

            case "do-what-it-says":
                return doWhatItSays();

            default:
                console.log("command not found!");
      }
}

// start functionality
start(process.argv);