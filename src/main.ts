import "./style.css";
import { drawImage } from "./clipCanvas.ts";
import { setup } from "./stage.ts";
import {setupWave} from "./wave.ts";

// three.jsのサンプルを動かす
setup();
window.addEventListener("load", async () => {
  await drawImage();
  setupWave()
});
