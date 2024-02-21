import pdfKit from "pdfkit";
import fs from "fs";
import c from "./coordinates.js";
const { coordinates } = c;

const chunky = (arr, chunks) => {
  let res = [];
  for (let i = 0; i < arr.length; i += chunks) {
    const chunk = arr.slice(i, i + chunks);
    res.push(chunk);
  }
  return res;
};

const generate = (items, template, fileName, includeLogo = true) => {
  let stream = fs.createWriteStream(fileName);
  try {
    const dimensions = {
      rows: 8,
      columns: 6,
      startX: 50,
      startY: 54,
      xMargin: 15.75, // 7/32nds
      yMargin: 15.25, // 7/32nds
      imageSize: 72,
      ...template,
    };

    const startXMargin = dimensions.startX;
    const startYMargin = dimensions.startY;
    const imageSize = dimensions.imageSize;
    const xMargin = dimensions.xMargin;
    const yMargin = dimensions.yMargin;

    const pages = chunky(chunky(items, dimensions.columns), dimensions.rows);
    console.log("Generating %d Pages", pages.length);

    let pdfDoc = new pdfKit({
      layout: dimensions.layout || undefined,
    });
    pdfDoc.pipe(stream);
    pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        pdfDoc.addPage();
      }
      page.forEach((row, rowIndex) => {
        row.forEach((image, columnIndex) => {
          const margins = coordinates.get(
            startXMargin,
            startYMargin,
            xMargin,
            yMargin,
            imageSize,
            rowIndex,
            columnIndex
          );
          if (includeLogo) {
            pdfDoc.image(
              image,
              margins.x + imageSize * 0.21,
              margins.y + imageSize * 0.1,
              {
                fit: [imageSize * 0.58, imageSize * 0.58],
                align: "center",
                valign: "top",
              }
            );
            pdfDoc.image(
              "images/logo.png",
              margins.x + imageSize * 0.225,
              margins.y + imageSize * 0.35,
              {
                //width: imageSize,
                //height: (80 / 300) * imageSize, //Aspect Ratio
                fit: [imageSize * 0.55, imageSize * 0.55],
                align: "center",
                valign: "bottom",
              }
            );
          } else {
            pdfDoc.image(image, margins.x, margins.y, {
              width: imageSize,
              height: imageSize,
              align: "center",
              valign: "top",
            });
          }
        });
      });
    });

    pdfDoc.end();
  } catch (error) {
    console.error(error);
    stream.destroy();
  }
};

//module.exports = { generate };
export default { generate };
