var img = sips.images[0];

function cropCell(c, r, filename) {
  var colW = 200;
  var rowH = 128;
  var sx = c * 205;
  var sy = r * 137;
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropCell(2, 4, "check_r4_c2.jpg");
cropCell(3, 4, "check_r4_c3.jpg");
cropCell(4, 4, "check_r4_c4.jpg");
