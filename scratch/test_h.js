var img = sips.images[0];
for (var h = 126; h <= 132; h += 2) {
  var canvas = new Canvas(201, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 1, 1, 201, h, 0, 0, 201, h);
  new Output(canvas, "h_" + h + ".jpg", "jpeg").addToQueue();
}
