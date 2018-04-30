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

  usage += 'To use this script, provide a url and a name to use for the screenshot folder'
  usage += '\nE.g. node index.js https://google.com sample'
  return usage
}

if (process.argv.length < 4) {
  console.log(properUsageString("Not enough arguments given"));
  return
}


// We just assume the user has put arguments in the right order
var url = process.argv[2];
var name = process.argv[3];

var location = screenshotFolder + '/' + name;


/* SCREENSHOTTERS */

var getDesktopShot = function() {
  var nightmare = new Nightmare();

  return nightmare
  .viewport(1920, 1080)
  .goto(url)
  .wait(1000)
  .screenshot(location + "/top_desktop.png")
  .scrollTo(1080, 0)
  .screenshot(location + "/scrolled_desktop.png")
  .end()
}

var getMobileShot = function() {
  var nightmare = new Nightmare();


  return nightmare
    .viewport(640, 1136)
    .goto(url)
    .wait(1000)
    .scrollTo(0, 0)
    .wait(100)
    .screenshot(location + "/top_mobile.png")
    .scrollTo(1136, 0)
    .screenshot(location + "/scrolled_mobile.png")
    .end()
}

// Creates the screenshot directory if it doesn't exist currently
if (!fs.existsSync(screenshotFolder)) {
  fs.mkdirSync(screenshotFolder);
}

// Actually make the screenshots
fs.mkdir(location, function(err) {
  q.all([ getDesktopShot(), getMobileShot() ])
  .then(function() {
    console.log("DONE");
  })
  .done()
});
