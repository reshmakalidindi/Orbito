var img = sips.images[0];

var colXs = [2, 207, 413, 619, 825];
var colW = 196;
var rowYs = [2, 139, 276, 413, 549];
var rowH = 131;

function cropCell(c, r, filename) {
  var sx = colXs[c];
  var sy = rowYs[r];
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropCell(0, 0, "test_c1_r0_c0.jpg"); // ML
cropCell(4, 0, "test_c1_r0_c4.jpg"); // Data Analytics
cropCell(2, 2, "test_c1_r2_c2.jpg"); // Interview skills
cropCell(0, 4, "test_c1_r4_c0.jpg"); // Entrepreneurship
cropCell(4, 4, "test_c1_r4_c4.jpg"); // Online Business
