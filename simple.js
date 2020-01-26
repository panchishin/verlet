window.onload = function() {

let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d");
let CANVAS_WIDTH = 500;
let CANVAS_HEIGHT = 500;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let boxes = [];

boxes.push(Box(100,100,100,100))
boxes.push(Doll(300,300,10,10))

let box = new Entity();
box.addDot(300,50, -5);
box.addDot(325,15);
box.addDot(350,50);
box.addStick(0, 1);
box.addStick(2, 1);
box.addStick(0, 2);
boxes.push(box)


function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for(let box of boxes) {
    box.update(ctx);
  }

  requestAnimationFrame(animate);
}
animate();

}