const sharp = require("sharp");

async function analyzeTopLeftPixel() {
  try {
    // Load the image
    const image = sharp("public/out.png");

    // Get image metadata
    const metadata = await image.metadata();
    console.log("Image metadata:", metadata);

    // Extract the top-left pixel (1x1 region)
    const pixelData = await image
      .extract({ left: 0, top: 0, width: 1, height: 1 })
      .raw()
      .toBuffer();

    // Convert buffer to color values
    const channels = metadata.channels || 3; // RGB or RGBA
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];
    const a = channels === 4 ? pixelData[3] : 255;

    console.log(
      `Top-left pixel color: RGB(${r}, ${g}, ${b})${
        channels === 4 ? `, Alpha: ${a}` : ""
      }`
    );
    console.log(
      `Hex color: #${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    );
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
}

analyzeTopLeftPixel();
