var img = sips.images[0];

function cropTight(c, r, filename) {
  var colW = 201;
  var rowH = 133;
  var sx = c * 205 + 1;
  var sy = r * 136 + 1;
  
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropTight(0, 0, "tight_1.jpg");
cropTight(4, 0, "tight_5.jpg");
cropTight(0, 4, "tight_21.jpg");
cropTight(4, 4, "tight_25.jpg");
