const LYRICIST = require('lyricist/node6');
const UTF8 = require('utf8');
require('dotenv').config();

const LYRICS = {};
const GENIUS = new LYRICIST(process.env.GENIUS_ACCESS_TOKEN);


//TODO: Simplify function, this is way too much.
LYRICS.findSong = (songName) => {
  
  return new Promise((resolve, reject) => {
    GENIUS.search(songName)
      
      .then((response) => {
        //FIXME: There should be nothing in this .then statement other than a resolution.
        
        // the response is structured as "song name + artist" for the search() method.
        // seperates them to verify the song title is correct.
        let split = songName.split(' + ');
        let passedTitle = split[0];
        //remove any instances of (, typically denotes a featured artist
        passedTitle = passedTitle.split(' (')[0];
        passedTitle = UTF8.encode(passedTitle);
        passedTitle = passedTitle.toLowerCase();
        
        // Verify the title of the song to the title fetched by Genius.
        let i = 0;
        for (i; i < response.length; i) {
          let responseTitle = response[i].title;
          //FIXME: This is repeated code.
          responseTitle = responseTitle.split(' (')[0];
          responseTitle = UTF8.encode(responseTitle);
          //removes all non-ascii characters to prevent Genius from coming up empty.
          responseTitle = responseTitle.replace(/[^\x00-\x7F]/g, "");
          responseTitle = responseTitle.toLowerCase();
          
          if (responseTitle === passedTitle) {
            resolve(response[i]);
            break;
          }
          else if (responseTitle !== passedTitle) i++;
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