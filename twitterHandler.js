const TWITTER = require('twitter');
const CLIENT = new TWITTER({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
require('dotenv').config();

const TWITTERHANDLER = {};


TWITTERHANDLER.sendTweet = (lyrics, mode) => {
  console.log(lyrics + '\n \nin mode ' + mode);
  
  if (mode === 'test') {
    return null;
  }
  else if (mode === 'prod') {
    CLIENT.post('statuses/update', {status: lyrics},  (err) => {
      if (err) console.log(err);
    });
  }
};



module.exports = TWITTERHANDLER;