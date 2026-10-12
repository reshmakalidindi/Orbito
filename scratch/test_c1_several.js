var img = sips.images[0];

function cropNoHeading(sx, sy, w, h, filename) {
  var canvas = new Canvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, w, h, 0, 0, w, h);
  new Output(canvas, filename, "jpeg").addToQueue();
}

cropNoHeading(825, 2, 196, 95, "c1_data_no_heading.jpg");
cropNoHeading(413, 276, 196, 95, "c1_interview_no_heading.jpg");
cropNoHeading(825, 549, 196, 95, "c1_online_no_heading.jpg");
