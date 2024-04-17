let video;
let opacitySlider; // Slider to control the opacity
let blurAmountSlider; // Slider to control the amount of motion blur
let stepXSlider; // Slider to control the step size in X direction
let stepYSlider; // Slider to control the step size in Y direction

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  // Sliders
  opacitySlider = createSlider(0, 255, 127);
  opacitySlider.position(10, height + 10);
  
  blurAmountSlider = createSlider(1, 20, 5);
  blurAmountSlider.position(10, height + 30);

  stepXSlider = createSlider(5, 20, 10);
  stepXSlider.position(10, height + 50);

  stepYSlider = createSlider(1, 10, 2);
  stepYSlider.position(10, height + 70);
}

function draw() {
  background(51);
  video.loadPixels();

  // Apply the slider's value for opacity to the video and add motion blur based on slider
  let blurAmount = blurAmountSlider.value();
  for (let i = 0; i < blurAmount; i++) {
    tint(255, opacitySlider.value() / blurAmount);
    image(video, -i * 2, 0); // Shift each frame slightly to the left
  }
  
  let stepY = stepYSlider.value(); // Dynamic step size in Y direction from slider
  let stepX = stepXSlider.value(); // Dynamic step size in X direction from slider
  
  // Draw motion-blurred higher fidelity contours
  for (let blurFrame = 0; blurFrame < blurAmount; blurFrame++) {
    let offsetX = -blurFrame * 2; // Calculate the offset for the current blur frame
    for (let y = 0; y < video.height; y += stepY) {
      beginShape();
      noFill();
      stroke(255, opacitySlider.value() / blurAmount); // Apply opacity to contour lines
      for (let x = 0; x <= video.width; x += stepX) {
        let idx = (y * video.width + x) * 4;
        let r = video.pixels[idx];
        let g = video.pixels[idx + 1];
        let b = video.pixels[idx + 2];
        let v = brightness(color(r, g, b)); // Calculate brightness
        let displacement = map(v, 0, 255, -10, 10); // Adjusted map range for finer control
        curveVertex(x + offsetX, y + displacement);
      }
      endShape();
    }
  }
}
