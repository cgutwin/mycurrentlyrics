const LYRIC_PROCESSOR = {};


// Strip the lyrics from specific characters, and return the modified array of lyrics.
LYRIC_PROCESSOR.stripLyrics = (lyrics) => {
  let split = lyrics.split('\n');
  
  // Remove any entries that contain [, denotes what each part of the song is.
  for (let i = 0; i < split.length; i++) {
    if (split[i].includes("[")) {
      split.splice(i, 1);
    }
  }
  
  // mark any empty strings as breaks in the song sections.
  for (let i = 0; i < split.length; i++) {
    if (split[i] === '') {
      split[i] = split[i].replace('', '-');
    }
  }
  
  // May have to escape backslashes.
  
  return split;
};



// This plate of spaghetti takes the lyrics grabbed from Genius, and creates an object
// with arrays containing grouped lyrics.

// TODO: Create a more efficient loop to split the lyrics.
LYRIC_PROCESSOR.splitUpLyrics = (lyrics) => {
  let object = {};
  let stripped = LYRIC_PROCESSOR.stripLyrics(lyrics);
  
  let i = 0;
  //loop through creating the groups arrays, +3 to cover one-liners at the end ( "-" + "line" + "-").
  for (i; i <= stripped.length + 3; i) {
    
    object[i] = [];
    
    //loop through the stripped lyrics, and push the current line x to the array i.
    for (let x = 0; x < stripped.length; x) {
      // remove the -'s which seperate preset groups.
      if (stripped[x] === '-') {
        stripped.splice(x, 1);
        x++;
        break;
      }
      else {
        object[i].push(stripped[x]);
        //remove the line from the buffer after it's been pushed to the object.
        stripped.splice(x, 1);
      }
    }
    i++;
  }
  
  return object;
};



// In our second pasta-based dish, we split the lyrics into coherent groups. Returned is an array of arrays.
// TODO: Optimize this section to group lyrics more efficiently.
LYRIC_PROCESSOR.groupLyrics = (lyrics) => {
  let splitLyrics = LYRIC_PROCESSOR.splitUpLyrics(lyrics);
  let groupedLyrics = [];
  
  //loop through the current split of lyrics
  for (let key in splitLyrics) {
    //this is the current split
    let group = splitLyrics[key];
    let arr = [];
    let i = 0;
    
    //loop through the split, and split them in half based on the number of lines.
    for (i; i < group.length; i++) {
      arr.push(group[i]);
  
      if (group.length >= 18) {
        if (i !== 0 && i % 2 === 0 || i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
      }
  
      if (group.length >= 12 && group.length < 18) {
        if (i !== 0 && Math.floor(i % 3) === 0 || i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
      }
      
      if (group.length >= 8 && group.length < 12) {
        if (i === Math.floor(group.length / 4) + 1 || i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
      }
      
      if (group.length === 7) {
        if (i !== 0 && i % 3 === 0 || i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
      }
  
      if (group.length === 2) {
        if (i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
      }
      /*
      * split at half the length
      * push when all lines are done, and at half
      * */
      if (group.length < 8 && group.length !== 2) {
        if (i === Math.floor(group.length / 2) || i === group.length - 1) {
          groupedLyrics.push(arr);
          arr = [];
        }
  
      }
    }
  }
  
  groupedLyrics = LYRIC_PROCESSOR.clearEmptyArrays(groupedLyrics);
  groupedLyrics = LYRIC_PROCESSOR.removeOneLiners(groupedLyrics);
  return groupedLyrics;
};



LYRIC_PROCESSOR.clearEmptyArrays = (group) => {
  let cleared = group;
  let i = 0;
  for (i; i < cleared.length; i++) {
    if (!cleared[i][0]) {
      cleared.splice(i, 1);
    }
  }
  
  return cleared;
};



//TODO: One-liners should ideally be kept.
// Are removed for now to get rid of extraneous, non coherent lyrics.
LYRIC_PROCESSOR.removeOneLiners = (group) => {
  let removed = group;
  let i = 0;
  for (i; i < removed.length; i) {
    if (removed[i].length === 1) {
      removed.splice(i, 1);
    }
    else {
      i++
    }
  }
  
  return removed;
};



module.exports = LYRIC_PROCESSOR;