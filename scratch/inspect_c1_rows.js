var img = sips.images[0];

// Let's test different heights for row 3 and row 4
function testRow(r, startY, h, filename) {
  var sx = 413; // column 2
  var sy = startY;
  var w = 196;
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, filename, "jpeg").addToQueue();
}

testRow(2, 276, 75, "row2_h75.jpg");
testRow(3, 413, 70, "row3_h70.jpg");
testRow(3, 413, 75, "row3_h75.jpg");
testRow(3, 413, 80, "row3_h80.jpg");
testRow(4, 549, 75, "row4_h75.jpg");
