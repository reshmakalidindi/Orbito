var img = sips.images[0];
var canvas = new Canvas(img.size.x, img.size.y);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);

var idata = ctx.getImageData(0, 0, img.size.x, img.size.y);
for (var x = 195; x <= 215; x++) {
  var idx = (60 * img.size.x + x) * 4;
  print("x=" + x + ": " + idata.data[idx] + "," + idata.data[idx+1] + "," + idata.data[idx+2]);
}

for (var y = 130; y <= 145; y++) {
  var idx = (y * img.size.x + 50) * 4;
  print("y=" + y + ": " + idata.data[idx] + "," + idata.data[idx+1] + "," + idata.data[idx+2]);
}
