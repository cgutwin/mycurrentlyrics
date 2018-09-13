const LASTFM_NODE = require('lastfm').LastFmNode;
const GENIUS = require('./genius');
const LYRIC_PROCESSOR = require('./lyricProcessor');
const TWITTER = require('./twitterHandler');

const LASTFM = new LASTFM_NODE({
  api_key: process.env.LASTFM_API_KEY,
  secret: process.env.LASTFM_SECRET,
  useragent: process.env.LASTFM_USER_AGENT,
});

const stream = LASTFM.stream(process.env.LASTFM_USERNAME, { autostart: true });
//test or prod
const MODE = 'test';

//FIXME: Double submissions. when the music is stopped, the nowPlaying picks up the stopped song again.
stream.on('nowPlaying', (track) => {
  console.log(`now playing ${track.name} by ${track.artist['#text']}`);
   GENIUS.findSong(`${track.name} + ${track.artist['#text']}`)
    .then((response) => {
      console.log(response);
      GENIUS.getLyrics(response.id)
        .then((response) => {
          let grouped = LYRIC_PROCESSOR.groupLyrics(response.lyrics);
          let snippet = grouped[Math.floor(Math.random()*grouped.length)];
          
          //break up the array, and append the entries to a string
          //TODO: There must be a way to simplify turning an array to a string.
          let tweet = '';
          for (let i = 0; i < snippet.length; i++) {
            let buffer = snippet[i];
            if (i !== snippet.length - 1) {
              //add a line break for twitter
              buffer += '\u000a';
            }
            tweet += buffer;
          }
  
          TWITTER.sendTweet(tweet, MODE);
        })
    })
     .catch((err) => {
       console.error(err);
     })
});


// FIXME: Suppress the error that LastFM throws when the stream stops.
stream.on('error', function(error) {
  if (error.message === "Cannot read property 'name' of undefined") {
    return null;
  }
  else {
    console.error('Error: '  + error.message);
  }
});