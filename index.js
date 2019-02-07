const LASTFM_NODE = require('lastfm').LastFmNode;
const GENIUS = require('./genius');
const LYRIC_PROCESSOR = require('./lyricProcessor');
const TWITTER = require('./twitterHandler');

const LASTFM = new LASTFM_NODE({
  api_key: process.env.LASTFM_API_KEY,
  secret: process.env.LASTFM_SECRET,
  useragent: process.env.LASTFM_USER_AGENT,
});

const STREAM = LASTFM.stream(process.env.LASTFM_USERNAME, { autostart: true });
//'test' or 'prod'.
//TODO: Unit testing instead of this thing.
const MODE = 'test';
let lastTweetMinutes = null;


const pickSnippetFromGroupedLyrics = (lyrics) => {
  let grouped = LYRIC_PROCESSOR.groupLyrics(lyrics);
  return grouped[Math.floor(Math.random()*grouped.length)];
}


// Turns the array lyricSnippet into a string for tweeting.
// TODO: Create function to keep character count under 240.
const formatStringForTwitter = (lyricSnippet) => {
  return lyricSnippet.join('\u000a');
}


//FIXME: Double submissions. when the music is stopped, the nowPlaying picks up the stopped song again.
STREAM.on('scrobbled', (track) => {
  console.log(`just scrobbled ${track.name} by ${track.artist['#text']}`);
  
  let date = new Date();
  let minutes = date.getMinutes();
  let diff = minutes - lastTweetMinutes;
  
  GENIUS.findSong(`${track.name} + ${track.artist['#text']}`)
    .then((response) => {
      
      GENIUS.getLyrics(response.id)
        .then((response) => {
          
          let lyricSnippet = pickSnippetFromGroupedLyrics(response.lyrics);
          let tweet = formatStringForTwitter(lyricSnippet);
  
          console.log(diff);
          //only send the tweet if one hasn't been sent in the last 15 minutes, null is initiation case
          if (Math.abs(diff) > 15 || lastTweetMinutes === null) {
  
            lastTweetMinutes = minutes;
            
            TWITTER.sendTweet(tweet, MODE)
              .then((response) => {
      
                console.log(response);
                let reply = [response.handle, track.artist['#text'], track.name];
                let formattedReply = formatStringForTwitter(reply);
      
                TWITTER.replyToTweet(response.id, formattedReply, MODE);
              })
          }
        })
        .catch(err => console.error(err))
    })
     .catch(err => console.error(err))
});

// FIXME: Suppress the error that LastFM throws when the stream stops.
STREAM.on('error', function(error) {
  if (error.message === "Cannot read property 'name' of undefined") {
    return null;
  }
  else {
    console.error('Error: '  + error.message);
  }
});