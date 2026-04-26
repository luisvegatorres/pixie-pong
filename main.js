// Initialize PIXI application for rendering the game
const app = new PIXI.Application();

// Configure the game canvas: set background color and dimensions
await app.init({
  backgroundColor: "#3398b9",
  width: 800,
  height: 800
});

// Add the canvas to the HTML container
document.getElementById("game").appendChild(app.canvas);

// Game configuration constants
const borderSize = 10;
const circleRadius = 10;

// Track which borders have been hit during gameplay
const hitBorders = {
  top: false,
  right: false,
  bottom: false,
  left: false
};

// Helper function to create colored rectangular borders
function createBorder(x, y, width, height, color) {
  const border = new PIXI.Graphics();
  border.rect(x, y, width, height);
  border.fill(color);
  app.stage.addChild(border);
  return border;
}

// Create borders on all four sides of the game area
const borders = {
  top: createBorder(0, 0, 800, borderSize, "#ff0000"),
  right: createBorder(790, 0, borderSize, 800, "#ff0000"),
  bottom: createBorder(0, 790, 800, borderSize, "#ff0000"),
  left: createBorder(0, 0, borderSize, 800, "#ff0000")
};

// Create the game ball (yellow circle)
const circle = new PIXI.Graphics();
circle.circle(0, 0, circleRadius);
circle.fill("#f5ef42");

// Position the ball in the center of the game area
circle.x = 400;
circle.y = 400;

// Add the ball to the game stage
app.stage.addChild(circle);

// Ball velocity in pixels per frame (x and y components)
let xv = 3;
let yv = 2;

// Mark a border as hit and change its color from red to white
function markBorderHit(borderName) {
  if (!hitBorders[borderName]) {
    hitBorders[borderName] = true;

    borders[borderName].clear();

    if (borderName === "top") {
      borders[borderName].rect(0, 0, 800, borderSize);
    }

    if (borderName === "right") {
      borders[borderName].rect(790, 0, borderSize, 800);
    }

    if (borderName === "bottom") {
      borders[borderName].rect(0, 790, 800, borderSize);
    }

    if (borderName === "left") {
      borders[borderName].rect(0, 0, borderSize, 800);
    }

    borders[borderName].fill("#ffffff");
  }
}

// Create a promise that resolves when the player wins
const gameComplete = new Promise((resolve) => {
  // Game loop that runs every frame
  app.ticker.add(() => {
    // Check if ball hits the right border
    if (circle.x + circleRadius >= 790) {
      circle.x = 790 - circleRadius;
      xv = -xv; // Bounce the ball back
      markBorderHit("right");
    }

    // Check if ball hits the left border
    if (circle.x - circleRadius <= 10) {
      circle.x = 10 + circleRadius;
      xv = -xv; // Bounce the ball back
      markBorderHit("left");
    }

    // Check if ball hits the bottom border
    if (circle.y + circleRadius >= 790) {
      circle.y = 790 - circleRadius;
      yv = -yv; // Bounce the ball back
      markBorderHit("bottom");
    }

    // Check if ball hits the top border
    if (circle.y - circleRadius <= 10) {
      circle.y = 10 + circleRadius;
      yv = -yv; // Bounce the ball back
      markBorderHit("top");
    }

    // Update ball position based on velocity
    circle.x += xv;
    circle.y += yv;

    // Check if all four borders have been hit
    const allBordersHit = Object.values(hitBorders).every(hit => hit);

    // Win condition: resolve the promise when all borders are hit
    if (allBordersHit) {
      resolve();
    }
  });
});

// Handle game completion
gameComplete.then(() => {
  app.ticker.stop(); // Stop the game loop
  alert("Game complete! The circle hit all four borders.");
});