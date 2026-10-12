var img = sips.images[0];

// Test extracting col 0, row 0 and col 4, row 4
var cols = 5;
var rows = 5;
var totalW = img.size.x;
var totalH = img.size.y;

for (var r = 0; r < rows; r++) {
  for (var c = 0; c < cols; c++) {
    var num = r * cols + c + 1;
    if (num === 1 || num === 5 || num === 25) {
      var x = Math.round(c * (totalW / cols)) + 2;
      var y = Math.round(r * (totalH / rows)) + 2;
      var w = Math.floor(totalW / cols) - 4;
      var h = Math.floor(totalH / rows) - 4;

      var canvas = new Canvas(w, h);
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      var out = new Output(canvas, "scratch/test_crops/test_" + num + ".jpg", "jpeg");
      out.addToQueue();
    }
  }
}
