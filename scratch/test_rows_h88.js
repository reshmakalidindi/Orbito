var img = sips.images[0];

function cropRowTest(r, filename) {
  var colXs = [2, 207, 413, 619, 825];
  var rowYs = [2, 139, 276, 413, 549];
  var sx = colXs[2]; // column 2
  var sy = rowYs[r];
  var w = 196;
  var h = 88;
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropRowTest(0, "row0_h88.jpg");
cropRowTest(1, "row1_h88.jpg");
cropRowTest(2, "row2_h88.jpg");
cropRowTest(3, "row3_h88.jpg");
cropRowTest(4, "row4_h88.jpg");
