var img = sips.images[0];
var canvas = new Canvas(img.size.x, img.size.y);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);

var idata = ctx.getImageData(0, 0, img.size.x, img.size.y);

// Scan row y = 60 across all x
var whiteCols = [];
for (var x = 0; x < img.size.x; x++) {
  var isWhite = true;
  // check 10 rows around 60
  for (var dy = 50; dy < 70; dy++) {
    var idx = (dy * img.size.x + x) * 4;
    var r = idata.data[idx];
    var g = idata.data[idx+1];
    var b = idata.data[idx+2];
    if (r < 235 || g < 235 || b < 235) {
      isWhite = false;
      break;
    }
  }
  if (isWhite) whiteCols.push(x);
}
print("White cols around y=60: " + whiteCols.join(", "));

// Scan col x = 100 across all y
var whiteRows = [];
for (var y = 0; y < img.size.y; y++) {
  var isWhite = true;
  for (var dx = 90; dx < 110; dx++) {
    var idx = (y * img.size.x + dx) * 4;
    var r = idata.data[idx];
    var g = idata.data[idx+1];
    var b = idata.data[idx+2];
    if (r < 235 || g < 235 || b < 235) {
      isWhite = false;
      break;
    }
  }
  if (isWhite) whiteRows.push(y);
}
print("White rows around x=100: " + whiteRows.join(", "));
