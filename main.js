const app = new PIXI.Application();

await app.init({
  backgroundColor: "#3398b9",
  width: 800,
  height: 800
});

document.getElementById("game").appendChild(app.canvas);

const borderSize = 10;
const circleRadius = 10;

const hitBorders = {
  top: false,
  right: false,
  bottom: false,
  left: false
};