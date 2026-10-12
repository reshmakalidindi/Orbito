var img = sips.images[0];
var canvas = new Canvas(img.size.x, img.size.y);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);

// We can check pixel data if getImageData is available
try {
  var idata = ctx.getImageData(0, 0, img.size.x, img.size.y);
  print("getImageData available! Data length: " + idata.data.length);
  
  // Find white horizontal lines (search rows)
  for (var y = 0; y < img.size.y; y++) {
    var whiteCount = 0;
    for (var x = 0; x < img.size.x; x++) {
      var idx = (y * img.size.x + x) * 4;
      var r = idata.data[idx];
      var g = idata.data[idx+1];
      var b = idata.data[idx+2];
      if (r > 240 && g > 240 && b > 240) whiteCount++;
    }
    if (whiteCount > img.size.x * 0.7) {
      print("White row at y=" + y + " (count: " + whiteCount + ")");
    }
  }

  // Find white vertical lines (search cols)
  for (var x = 0; x < img.size.x; x++) {
    var whiteCount = 0;
    for (var y = 0; y < img.size.y; y++) {
      var idx = (y * img.size.x + x) * 4;
      var r = idata.data[idx];
      var g = idata.data[idx+1];
      var b = idata.data[idx+2];
      if (r > 240 && g > 240 && b > 240) whiteCount++;
    }
    if (whiteCount > img.size.y * 0.7) {
      print("White col at x=" + x + " (count: " + whiteCount + ")");
    }
  }

} catch(e) {
  print("Error: " + e);
}
