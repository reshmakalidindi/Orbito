// Test sips canvas
var img = sips.images[0];
var canvas = new Canvas(204, 136);
var ctx = canvas.getContext("2d");
// drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
ctx.drawImage(img, 0, 0, 204, 136, 0, 0, 204, 136);
var out = new Output(canvas, "scratch/test_crop/cell1_canvas.jpg", "jpeg");
out.addToQueue();
