var img = sips.images[0];
var canvas = new Canvas(200, 130);
var ctx = canvas.getContext("2d");
print("drawImage function: " + ctx.drawImage);
print("Canvas properties: " + Object.keys(canvas));
print("Context properties: " + Object.keys(ctx));
