var img = sips.images[0];

var colXs = [2, 207, 413, 619, 825];
var colW = 196;
var rowYs = [2, 173, 344, 515];
var rowH = 158;

function cropAndSave(c, r, filename) {
  var sx = colXs[c];
  var sy = rowYs[r];
  var canvas = new Canvas(colW, rowH);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
  new Output(canvas, filename, "jpeg").addToQueue();
}

// Row 0
cropAndSave(0, 0, "yoga-beginners.jpg");
cropAndSave(1, 0, "mindfulness-meditation.jpg");
cropAndSave(2, 0, "cooking-beginners.jpg");
cropAndSave(3, 0, "baking-cake-decoration.jpg");
cropAndSave(4, 0, "home-gardening.jpg");

// Row 1
cropAndSave(0, 1, "diy-crafts-jewellery.jpg");
cropAndSave(1, 1, "personal-styling-fashion.jpg");
cropAndSave(2, 1, "first-aid-emergency.jpg");
cropAndSave(3, 1, "nature-walk-birdwatching.jpg");
cropAndSave(4, 1, "hiking-trekking.jpg");

// Row 2
cropAndSave(0, 2, "community-volunteering.jpg");
cropAndSave(1, 2, "board-games.jpg");
cropAndSave(2, 2, "quiz-trivia.jpg");
cropAndSave(3, 2, "theatre-improvisation.jpg");
cropAndSave(4, 2, "video-editing.jpg");

// Row 3
cropAndSave(0, 3, "3d-modelling-printing.jpg");
cropAndSave(1, 3, "no-code-app.jpg");
cropAndSave(2, 3, "electronics-gadget-repair.jpg");
cropAndSave(3, 3, "foreign-language.jpg");
cropAndSave(4, 3, "everyday-diy-repair.jpg");
