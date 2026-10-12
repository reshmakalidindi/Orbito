var img = sips.images[0];

function cropC2(c, r, filename) {
  var colW = 200;
  var rowH = 162;
  var sx = c * 205 + (c === 0 ? 0 : 0);
  var sy = r * 171 + (r === 0 ? 0 : 0);
  
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropC2(0, 0, "c2_1.jpg");   // #1: Yoga for Beginners
cropC2(4, 0, "c2_5.jpg");   // #5: Home Gardening
cropC2(0, 3, "c2_16.jpg");  // #16: 3D Modelling
cropC2(4, 3, "c2_20.jpg");  // #20: Everyday DIY
