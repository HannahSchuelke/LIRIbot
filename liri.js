// At the top, dependancies go here (anything with a require):
require("dotenv").config();
const Spotify = require("node-spotify-api");
var axios = require("axios");
// Add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
const moment = require("moment");
const fs = require("fs");


// You should then be able to access your keys information like so
var spotify = new Spotify(keys);






// Make it so liri.js can take in one of the following commands:
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

// node liri.js concert-this <artist/band name here>

// OMDb API with a default parameter of favorite in IF statements
async function movieSearch(movie) {

    if (!movie) {
        movie = "wizard of oz";
    }
    // console.log("movieSearch() ran");
    // console.log("here is our movie to search: ", movie);
    // We then run the request with axios module on a URL with a JSON
    // axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(response => {
    //     // Then we print out the imdbRating
    //     console.log("The movie's rating is: " + response.data.imdbRating);
    // }).catch(error =>{
    //     console.log("oh no! we got an error!, this is the error: ", error);
    // })

    try {
        const thisBecomesTheDotThenInAsyncAwait = await axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy");
        // console.log("All the data: ", thisBecomesTheDotThenInAsyncAwait.data);
        console.log("The movie's rating is: " + thisBecomesTheDotThenInAsyncAwait.data.imdbRating);
        console.log("Title: " + thisBecomesTheDotThenInAsyncAwait.data.Title);
        console.log("Year: " + thisBecomesTheDotThenInAsyncAwait.data.Year);
        console.log("Rotten Tomatoes Rating: " + thisBecomesTheDotThenInAsyncAwait.data.Ratings[1].Value);
        console.log("Country: " + thisBecomesTheDotThenInAsyncAwait.data.Country);
        console.log("Language: " + thisBecomesTheDotThenInAsyncAwait.data.Language);
        console.log("Plot: " + thisBecomesTheDotThenInAsyncAwait.data.Plot);
        console.log("Actors: " + thisBecomesTheDotThenInAsyncAwait.data.Actors);
    } catch (error) {
        console.log("oh no! we got an error!, this is the error: ", error);
    }


}


// Bands in Town API:
async function searchBandsInTown(artist) {
    // console.log("searchBandsInTown ran");
    console.log("here is our band to search: " + artist);

    if (!artist) {
        artist = "deadmau5";
    }

    let bandInfo = await axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=oisacfioqwuuwfcenqou");
    bandInfo = bandInfo.data[0];
    // console.log(bandInfo);

    console.log("Venue Name: " + bandInfo.venue.name);
    console.log("Location: " + bandInfo.venue.city + ", " + bandInfo.venue.country);
    console.log("Date of Next Event: " + moment(bandInfo.datetime).format(('MMMM Do YYYY, h:mm:ss a')));
}

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

            // console.log("spotify data: ", data.tracks.items);
            const songInfo = data.tracks.items[0];
            // console.log("song info: ", songInfo);
            console.log("Artist: " + songInfo.artists[0].name);
            console.log("Song: " + songInfo.name);
            console.log("Album: " + songInfo.album.name);
            console.log("Preview Link: " + songInfo.album.href);
        }
    )

}

function testLiriCommand() {
    console.log("This worked!");
}

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


// trimming down our array to be with more usuable, clean data
function start(processArgs) {
    // console.log("inside start(), here is our processArgs: ", processArgs);
    let commandArray = processArgs.slice(2);
    // console.log("inside start(), here is our commandArray: ", commandArray);
    // switch statement = longer, clearner if/else block

    const userCommand = commandArray[0];

    // if(userCommand == "concert-this"){
    //     return searchBandsInTown();
    // }
    // else if(userCommand == "spotify-this-song"){
    //     return spotifySearch();
    // }else if(userCommand == "movie-this"){
    //     return movieSearch();
    // }else if(userCommand == "do-what-it-says"){
    //     return doWhatItSays();
    // }else {
    //     console.log("command not found!");
    // }

    // using the slice command again, in order to not have to use quotes for titles
    // .join will turn the array into a string... we're joining it by a space
    // start functionality




    let searchItem = commandArray.slice(1).join(" ");


    // console.log("searchItem: ", searchItem);

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

start(process.argv);