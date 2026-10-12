var img = sips.images[0];
// If sx, sy is first:
// Let's test cropping from x=205, y=0 (which is "2. Cloud Computing and AWS Basics")
// Method A: (img, sx, sy, sw, sh, dx, dy, dw, dh)
var cA = new Canvas(200, 130);
var ctxA = cA.getContext("2d");
ctxA.drawImage(img, 205, 0, 200, 130, 0, 0, 200, 130);
new Output(cA, "test_order_A.jpg", "jpeg").addToQueue();

// Method B: (img, dx, dy, dw, dh, sx, sy, sw, sh)
var cB = new Canvas(200, 130);
var ctxB = cB.getContext("2d");
ctxB.drawImage(img, 0, 0, 200, 130, 205, 0, 200, 130);
new Output(cB, "test_order_B.jpg", "jpeg").addToQueue();
