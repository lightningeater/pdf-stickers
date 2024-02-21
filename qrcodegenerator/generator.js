/**
 * Uses QR Code Generator from:
 * https://github.com/kozakdenys/qr-code-styling#readme
 * Configuration Generator: https://qr-code-styling.com/
 */
import { JSDOM } from "jsdom";
import "node-self";

global.window = new JSDOM().window;
global.self = global.window;
global.document = global.window.document;
global.XMLSerializer = global.window.XMLSerializer;
import QRCodeStyling from "qr-code-styling-node";
import fs from "fs";

import { createCanvas, loadImage } from "canvas";
import convertSvgToPng from "convert-svg-to-png";
const { convert } = convertSvgToPng;
import QRCodeConfiguration from "./QRCodeConfiguration.js";

const generate = async (
  code,
  config = QRCodeConfiguration,
  saveToDisk = false
) => {
  const saveSvg = false;
  const savePng = true;
  const saveTxt = false;

  let qrCode = new QRCodeStyling({
    ...config,
    jsdom: JSDOM,
    data: "https://app.sticflic.com/s/:code".replace(":code", code),
  });

  let buffer = await qrCode.getRawData("svg");

  if (saveToDisk && saveSvg) {
    fs.createWriteStream("codes/" + code + "-qr.svg").write(buffer);
  }

  let png = await convert(buffer);

  if (saveToDisk && savePng) {
    fs.createWriteStream("codes/" + code + "-qr.png").write(png);
  }

  let canvas = createCanvas(300, 300);
  let ctx = canvas.getContext("2d");
  let img = await loadImage(png);

  ctx.drawImage(img, 0, 0, 300, 300);
  const dataUrl = canvas.toDataURL("image/png");

  //Cleanup
  qrCode = buffer = png = canvas = ctx = img = undefined;
  if (saveToDisk && saveTxt) {
    fs.createWriteStream("codes/" + code + "-qr.txt").write(dataUrl);
  }

  return dataUrl;
};

export default generate;
