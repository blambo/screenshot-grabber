var fs = require('fs');
var q = require('q');
var Nightmare = require('nightmare');

Nightmare.Promise = q.Promise;

var screenshotFolder = './screenshots';

/* COMMAND LINE ARGUMENTS */

var properUsageString = function(errorMsg) {
  var usage = '';
  if (errorMsg != null) {
    usage += errorMsg;
  }
  usage += '\n';

  usage += 'To use this script, provide a url and name pair for each site you wish to screenshote'
  usage += '\nE.g. node index.js https://google.com sample https://yahoo.com sample2'
  return usage
}

if (process.argv.length < 4) {
  console.log(properUsageString("Not enough arguments given"));
  return
}

if (process.argv.length % 2 !== 0) {
  console.log(properUsageString("Doesn't seem like pairs were given. I need pairs of urls and names"));
  return
}


// We just assume the user has put arguments in the right order
var url = process.argv[2];
var name = process.argv[3];

var location = screenshotFolder;


/* SCREENSHOTTERS */

var getDesktopShot = function() {
  var nightmare = new Nightmare({
    frame: false,
    useContentSize: true
  });

  return nightmare
  .viewport(1920, 1080)
  .goto(url)
  .wait(1000)
  .screenshot(location + `/top-desktop/${name}-top-desktop.png`)
  .scrollTo(1080, 0)
  .screenshot(location + `/scrolled-desktop/${name}-scrolled-desktop.png`)
  .end()
}

var getMobileShot = function() {
  var nightmare = new Nightmare({
    frame: false,
    useContentSize: true
  });


  return nightmare
    .viewport(640, 1136)
    .goto(url)
    .wait(1000)
    .scrollTo(0, 0)
    .wait(100)
    .screenshot(location + `/top-mobile/${name}-top-mobile.png`)
    .scrollTo(1136, 0)
    .screenshot(location + `/scrolled-mobile/${name}-scrolled-mobile.png`)
    .end()
}

// Creates the screenshot directory if it doesn't exist currently
var locations = [
  "",
  "/top-desktop",
  "/top-mobile",
  "/scrolled-desktop",
  "/scrolled-mobile"
];

for (var i = 0; i < locations.length; i++) {
  if (!fs.existsSync(location + locations[i])) {
    fs.mkdirSync(location + locations[i]);
  }
}

// Actually make the screenshots
var takeScreenshot = function(url, name) {

  return q.all([ getDesktopShot(), getMobileShot() ])

};


var screenshotting = [];

for ( var i = 2; i < process.argv.length; i += 2) {
  var url = process.argv[i];
  var name = process.argv[i + 1];

  screenshotting.push(takeScreenshot(url, name));
}

q.all(screenshotting)
.then(function() {
  console.log("DONE");
})
.catch(function(err) {
  console.error(err);
})
.done();
