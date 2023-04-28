import picture from "../public/picture.jpeg";
import svg from "../public/blob.svg";

export const drawImage = async () => {
  const canvas = document.querySelector<HTMLCanvasElement>("#clip-canvas");
  const img = new Image();
  img.src = picture;
  const svgImage = new Image();
  svgImage.src = svg;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if(!ctx) return
  img.addEventListener("load", () => {
    ctx.globalCompositeOperation = "source-over"
    ctx.drawImage(img, 0, 0, 400, 400);
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(svgImage, 0,0,400,400)
  });
};
