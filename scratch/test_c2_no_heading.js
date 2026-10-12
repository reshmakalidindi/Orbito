var img = sips.images[0];

function testCropC2(h, filename) {
  var sx = 2;
  var sy = 2;
  var w = 196;
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, filename, "jpeg").addToQueue();
}

testCropC2(115, "c2_h115.jpg");
testCropC2(120, "c2_h120.jpg");
testCropC2(125, "c2_h125.jpg");
testCropC2(130, "c2_h130.jpg");
