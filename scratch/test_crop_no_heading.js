var img = sips.images[0];

function testCrop(h, filename) {
  var sx = 2;
  var sy = 2;
  var w = 196;
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, filename, "jpeg").addToQueue();
}

testCrop(90, "crop_h90.jpg");
testCrop(95, "crop_h95.jpg");
testCrop(100, "crop_h100.jpg");
testCrop(105, "crop_h105.jpg");
