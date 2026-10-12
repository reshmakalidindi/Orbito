var img = sips.images[0];
var isCollage1 = (img.size.height === 682 && img.size.width === 1024);

// Collage 1 extraction (h = 80 eliminates bottom black text banner)
if (img.size.height === 682) {
  var colXs = [2, 207, 413, 619, 825];
  var colW = 196;
  var rowYs = [2, 139, 276, 413, 549];
  var rowH = 80;

  function cropAndSave(c, r, filename) {
    var sx = colXs[c];
    var sy = rowYs[r];
    var canvas = new Canvas(colW, rowH);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, colW, rowH, 0, 0, colW, rowH);
    new Output(canvas, filename, "jpeg").addToQueue();
  }

  // Row 0
  cropAndSave(0, 0, "machine-learning.jpg");
  cropAndSave(1, 0, "cloud-computing.jpg");
  cropAndSave(2, 0, "cybersecurity.jpg");
  cropAndSave(3, 0, "robotics-arduino.jpg");
  cropAndSave(4, 0, "data-analytics.jpg");

  // Row 1
  cropAndSave(0, 1, "photography.jpg");
  cropAndSave(1, 1, "digital-art.jpg");
  cropAndSave(2, 1, "painting-canvas.jpg");
  cropAndSave(3, 1, "creative-writing.jpg");
  cropAndSave(4, 1, "dance-beginners.jpg");

  // Row 2
  cropAndSave(0, 2, "music-guitar.jpg");
  cropAndSave(1, 2, "public-speaking.jpg");
  cropAndSave(2, 2, "interview-skills.jpg");
  cropAndSave(3, 2, "resume-linkedin.jpg");
  cropAndSave(4, 2, "teamwork-leadership.jpg");

  // Row 3
  cropAndSave(0, 3, "english-communication.jpg");
  cropAndSave(1, 3, "time-management.jpg");
  cropAndSave(2, 3, "competitive-programming.jpg");
  cropAndSave(3, 3, "design-thinking.jpg");
  cropAndSave(4, 3, "startup-validation.jpg");

  // Row 4
  cropAndSave(0, 4, "entrepreneurship-pitching.jpg");
  cropAndSave(1, 4, "personal-finance.jpg");
  cropAndSave(2, 4, "digital-marketing.jpg");
  cropAndSave(3, 4, "negotiation-decision.jpg");
  cropAndSave(4, 4, "online-business.jpg");
}
