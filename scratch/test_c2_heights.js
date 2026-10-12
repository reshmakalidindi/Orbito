var img = sips.images[0];
var colXs = [2, 207, 413, 619, 825];
var rowYs = [2, 173, 344, 515];
var w = 196;

for (var h = 105; h <= 118; h += 3) {
  var sx = colXs[0];
  var sy = rowYs[2];
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, "test_c2_r2_h" + h + ".jpg", "jpeg").addToQueue();
}
