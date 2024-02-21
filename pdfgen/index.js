import gen from "./generate.js";
import rc from "./readCodes.js";
const { generate } = gen;
const { read } = rc;
import templates from "./templates.js";

import { LowSync, JSONFileSync } from "lowdb";
const adapter = new JSONFileSync("../db.json");
const db = new LowSync(adapter);
db.read();
db.data = db.data || { codes: [], qrcodes: [], usedQrCodes: [] };
/*
72pts per inch.
*/

function GeneratePDF(templateName, suffix, includeLogo = true) {
  let fileName = `${templateName}-${suffix}.pdf`;
  let template = templates[templateName];
  GetCodes()
    .then((files) => {
      generate(files, template, fileName, includeLogo);
      template = fileName = undefined;
    })
    .catch((error) => console.error(error));
}

async function GetCodes() {
  if (db.data && db.data.qrcodes) {
    console.log("Reading from DB...");
    return db.data.qrcodes.map((item) => item.qrcode);
  } else {
    console.log("Reading from files...");
    return read().then((files) => {
      return files;
    });
  }
}
function run() {
  db.data.usedQrCodes = { white1dot5x1dot5: [], ...db.data.usedQrCodes };
  //GeneratePDF('1x1', 'transparent');
  //db.data.usedQrCodes.push({ 'transparent1x1': [...db.data.qrcodes] });
  //GeneratePDF('1x1', 'white');
  //db.data.usedQrCodes.push({ 'white1x1': [...db.data.qrcodes] });
  //GeneratePDF('2x2', 'transparent');
  //db.data.usedQrCodes.push({ 'transparent2x2': [...db.data.qrcodes] });
  //GeneratePDF('2x2', 'white');
  //db.data.usedQrCodes.push({ 'white2x2': [...db.data.qrcodes] });

  GeneratePDF("1.5x1.5", "white", false);
  db.data.usedQrCodes.white1dot5x1dot5 = [...db.data.qrcodes];
  db.write();

  db.data.qrcodes.splice(0, db.data.qrcodes.length);
  db.write();
}

function examplePdf(templateName) {
  let image1 = "./images/qr.png";
  let template = templates[templateName];
  let fileName = `test-${templateName}.pdf`;
  const { columns, rows } = template;
  const pages = 1;

  const items = [...new Array(columns * rows * pages)].map((o, i) => image1);
  console.log("Generating %s example pdf: %s", templateName, fileName);
  generate(items, template, fileName);
}
/*
examplePdf("1x1");
examplePdf("1.5x1.5");
examplePdf("2x2");
*/

run();
