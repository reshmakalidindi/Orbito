var img = sips.images[0];
var colXs = [2, 207, 413, 619, 825];
var rowYs = [2, 139, 276, 413, 549];
var w = 196;
var h = 80;

for (var r = 0; r < 5; r++) {
  var sx = colXs[0];
  var sy = rowYs[r];
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, "test_h80_r" + r + ".jpg", "jpeg").addToQueue();
}
