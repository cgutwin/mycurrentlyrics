# MyCurrentLyrics

##### A Twitter bot to tweet song lyrics 🎶

### How it works
The script utilizes data from the following APIs: 
- [Last.fm](https://www.last.fm/api)
- [Genius](https://genius.com/developers)

Last.fm detects when you start listening to a song, and passes it to Genius, which will then
get the associated lyrics.

Processing on the lyrics are done to group them in a coherent format for Twitter, which are then posted.


### Use it yourself

To get going, you'll need a couple of things:

- A Twitter account to post under
- [Developer access for that account](https://developer.twitter.com/)
- Access to the [Last.fm API](https://www.last.fm/api)
- Access to the [Genius API](https://genius.com/developers)
- A server running NodeJS.


Once you have your keys and whatnot:
1. Clone the project into your own environment.
2. Run `npm install`
3. Add your keys and tokens to the `template.env` file under the correct names, and rename it to `.env`.

To send to Twitter, change `MODE` in `index.js` to `prod`. Get on me to test properly.


### TODO:

- Work on the processing algorithm to better group lyrics.
- Implement grouping by rhymes within sections.
- Optimize the processing algorithms to improve efficiency.
- Fix double submissions when the current playing song is stopped.
- Abstract functions.
- Unit testing.


### LICECNSE
MIT
