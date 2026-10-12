var img = sips.images[0];

var colXs = [2, 207, 413, 619, 825];
var colW = 196;
var rowYs = [2, 173, 344, 515];
var rowH = 162;

function cropCell(c, r, filename) {
  var sx = colXs[c];
  var sy = rowYs[r];
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropCell(0, 0, "test_c2_r0_c0.jpg"); // Yoga
cropCell(4, 0, "test_c2_r0_c4.jpg"); // Home Gardening
cropCell(2, 1, "test_c2_r1_c2.jpg"); // First Aid
cropCell(0, 3, "test_c2_r3_c0.jpg"); // 3D Modelling
cropCell(4, 3, "test_c2_r3_c4.jpg"); // Everyday DIY
