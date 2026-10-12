var img = sips.images[0];
var canvas = new Canvas(img.size.x, img.size.y);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0);

// We want to see how tall the text bar is at the bottom of cell (0, 0)
// Cell (0,0) in Collage 1 was sx=2, sy=2, w=196, h=128
// Let's inspect rows from y=90 to 128 in that cell to find where the dark banner starts!
var idata = ctx.getImageData(0, 0, img.size.x, img.size.y);
for (var y = 80; y <= 128; y++) {
  // sample x at 100
  var idx = (y * img.size.x + 100) * 4;
  var r = idata.data[idx];
  var g = idata.data[idx+1];
  var b = idata.data[idx+2];
  print("y=" + y + " (cell rel y=" + (y-2) + "): rgb=" + r + "," + g + "," + b);
}
