var img = sips.images[0];
var canvas = new Canvas(10, 10);
var ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, 10, 10, 0, 0, 10, 10);
new Output(canvas, "assets/images/courses/test_dest.jpg", "jpeg").addToQueue();
