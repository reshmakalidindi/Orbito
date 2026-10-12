var img = sips.images[0];
var canvas = new Canvas(img.size.x, img.size.y);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);

var idata = ctx.getImageData(0, 0, img.size.x, img.size.y);
// Check around y = 135 to 140 at x = 100
for (var y = 130; y <= 140; y++) {
  var idx = (y * img.size.x + 100) * 4;
  print("y=" + y + " RGB=(" + idata.data[idx] + "," + idata.data[idx+1] + "," + idata.data[idx+2] + ")");
}
// Check around x = 200 to 210 at y = 70
for (var x = 200; x <= 210; x++) {
  var idx = (70 * img.size.x + x) * 4;
  print("x=" + x + " RGB=(" + idata.data[idx] + "," + idata.data[idx+1] + "," + idata.data[idx+2] + ")");
}
