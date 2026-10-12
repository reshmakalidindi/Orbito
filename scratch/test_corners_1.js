var img = sips.images[0];

function cropCell(c, r, filename) {
  var colW = 204;
  var rowH = 136;
  var sx = c * (colW + 1);
  var sy = r * (rowH + 1);
  if (c === 4) sx = 1024 - colW;
  if (r === 4) sy = 682 - rowH;
  
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropCell(0, 0, "scratch/test_crops/corner_1.jpg");   // #1: Machine Learning
cropCell(4, 0, "scratch/test_crops/corner_5.jpg");   // #5: Data Analytics
cropCell(0, 4, "scratch/test_crops/corner_21.jpg");  // #21: Entrepreneurship
cropCell(4, 4, "scratch/test_crops/corner_25.jpg");  // #25: Online Business
