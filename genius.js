const LYRICIST = require('lyricist/node6');
const UTF8 = require('utf8');
require('dotenv').config();

const LYRICS = {};
const GENIUS = new LYRICIST(process.env.GENIUS_ACCESS_TOKEN);

// `songInfo` is structured as "song name + artist".
// Split just to get the songTitle to work with.
const getSongTitleFromLastfmResults = (songInfo) => {
  let split = songInfo.split(' + ');
  return split[0];
};


//Some results from Genius contain non-ASCII characters
const removeExtrasFromSongTitle = (songTitle) => {
  return songTitle.toString().split(' (')[0];
};

//Takes the input and outputs a uniform, formatted result.
const formatSongTitle = (songTitle) => {
  let formatted = '';
  
  formatted = removeExtrasFromSongTitle(songTitle);
  formatted = UTF8.encode(songTitle);
  formatted = formatted.replace(/[^\x00-\x7F]/g, "");
  formatted = formatted.toLowerCase();
  
  return formatted;
};


const songTitlesAreEqual = (lastfmTitle, geniusTitle) => {
  let formattedTitles = formatSongTitle.apply(this, arguments);
  return formattedTitles[0] === formattedTitles[1];
};


//songName is the formatted `song + artist`
LYRICS.findSong = (songName) => {
  
  return new Promise((resolve, reject) => {
    GENIUS.search(songName)
      
      .then((response) => {
        let lastfmTitle = getSongTitleFromLastfmResults(songName);
        
        // Verify the title of the song to the title fetched by Genius.
        let i = 0;
        for (i; i < response.length; i) {
          let geniusTitle = response[i].title;
          
          if (songTitlesAreEqual(lastfmTitle, geniusTitle)) {
            resolve(response[i]);
            break;
          }
          else if (!songTitlesAreEqual(lastfmTitle, geniusTitle)) i++;
          //to test if the values were even returned properly.
          //TODO: Test if this is needed.
          else {
            i++;
            reject("resp title !== passed or no song exists in genius");
          }
        }
        
      })
      
      .catch((err) => {
        reject(err);
      })
  });
  
};



LYRICS.getLyrics = (songId) => {
  
  return new Promise((resolve, reject) => {
    GENIUS.song(songId, { fetchLyrics: true })
      .then((response) => {
        resolve(response)
      })
      .catch((err) => {
        reject(err);
      })
  });
  
};



module.exports = LYRICS;