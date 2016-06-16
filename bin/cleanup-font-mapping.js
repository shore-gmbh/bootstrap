/**
 * HOW TO USE:
 * Use this script to clean up the character mappings from the fontastic page, when they get mixed up.
 * 1. Run this script: It will read the character mapping from the currently published icon reference at surge
 * 2. Copy the function that is printed to the console.
 * 3. Go to the fontastic page, click on the tab customize.
 * 4. Paste the function into the browser console and run to define the function.
 * 5. Run the function <function name below>() and make sure everything is correct.
 * NOTE: All characters mappings are first reset to an unused range, using a rangeOffset,
 * then the values of the reference are applied. Values that are not in the reference will
 * likely have new values after this. This is mostly okay when they haven't been used before.
 */
//
// inject the script like this after running npm start
var system = require('system');
var fs = require('fs');
var page = require('webpage').create();

var cwd = system.args[0].replace(new RegExp(fs.separator + '[^' + fs.separator + ']+$'), '');
fs.changeWorkingDirectory(cwd);

page.onError = function(e) {
	console.log(e);
  phantom.exit();
};

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.open('http://shore-bootstrap-theme.surge.sh/shore-icons/icons-reference.html', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render(fs.workingDirectory + fs.separator + 'font-backup.png');

    page.includeJs('https://code.jquery.com/jquery-2.2.4.min.js', function() {
      var map = page.evaluate(function() {
        var cssNames = jQuery('.css-mapping > li > input');
        var charPoints = jQuery('.character-mapping > li > input');
        var map = {};
        var i;

        if(cssNames.length != charPoints.length) {
          throw new Error('Collections need to be of same length.');
        }

        for(i = 0; i < cssNames.length; i++) {
          map[cssNames[i].value] = charPoints[i].value;
        }

        return map;
      });

      // Function to apply the mapping from surge to the customize page in fontastic
      function applyMappings() {
        // map will be replaced later
        var map = __MAPPING__;
        var cssCollection = jQuery('.glyphs-css > li input');
        var charCollection = jQuery('.glyphs > li input');

        if (cssCollection.length != charCollection.length) {
          throw new Error('Collections need to be of same length.');
        }
        // helper functions to create the right format
        function formatCharCode(code) {
          return code.replace(/^&#x(.+?);/, 'U+$1').toUpperCase();
        }
        function extractDigits(code) {
          return code.replace(/^U\+/, '');
        }

        // reset all keycodes that are in the map, use range F... so it does not clash with any existing values
        var rangeOffset = Math.ceil(charCollection.length/100)*100;
        charCollection.each(function(i) {
          jQuery(this).val('E' + ("000" + (i + rangeOffset)).slice(-3)).trigger('focusout');
        });

        var keys = Object.keys(map);
        keys.forEach(function(cssName, i) {
          // find element with the cssName and get its position inside the cssNames collection
          var index = cssCollection.index(cssCollection.filter('[value="' + cssName + '"]'));
          // get element in char mapping collection with that position and set the codepoint to the input field
          var charElement = charCollection.eq(index);
          var formattedCode = formatCharCode(map[cssName]);
          if (charElement.val() !== formattedCode) {
            console.log(i + '. Setting code Point: ' + cssName + ', Setting ' + charElement.val() + ' to ' + formattedCode);
            charElement.val(extractDigits(formattedCode)).trigger('focusout');
          }
        });
        console.log('Done');
      }

      // export string representation of the function ot console
      console.log('Copy the following function and run it in a browser console on fontastic:\n'
        + 'Then run the function with "applyMappings();" \n'
        + '>>>>>>>>>>>>>>>>>>>>>>>>>\n'
        + applyMappings.toString().replace('__MAPPING__', JSON.stringify(map)).replace(/\/\/.*?\n/g, '').replace(/\n/g, '') + '\n'
        + '<<<<<<<<<<<<<<<<<<<<<<<<< End\n');

      phantom.exit();
    });
  } else {
    console.log('Can\'t open page');
    phantom.exit();
  }
});
