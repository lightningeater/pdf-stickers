"use strict";
import { LowSync, JSONFileSync } from "lowdb";
import { customAlphabet } from "nanoid";
import generate from "./generator.js";
import config from "./config/index.js";

let adapter = new JSONFileSync("../db.json");
let db = new LowSync(adapter);
db.read();
db.data = db.data || { codes: [], qrcodes: [] };

const debug = false;

async function run(numberOfCodes = 1, config = undefined) {
  var start = process.hrtime();

  var elapsed_time = function (note, reset) {
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(
      process.hrtime(start)[0] +
        " s, " +
        elapsed.toFixed(precision) +
        " ms - " +
        note
    ); // print message + time
    if (reset) start = process.hrtime(); // reset the timer
  };

  elapsed_time("QR Code generator starting");
  console.info("Generating %d codes", numberOfCodes);
  let nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    6
  );

  //let codes = []; //TODO: wire to database?

  const generateUniqueCode = () => {
    const code = nanoid();
    if (db.data.codes.includes(code)) return generateUniqueCode();
    db.data.codes.push(code);
    return code;
  };

  const generateCodeBatch = (size) => {
    return [...new Array(size)].map((i) => generateUniqueCode());
  };

  let batch = generateCodeBatch(numberOfCodes);

  for (const code of batch) {
    let qrcode = await generate(code, config, debug);
    db.data.qrcodes.push({ code, qrcode });
  }

  elapsed_time("QR Code generation complete");
  batch = start = undefined;
  return [...db.data.qrcodes];
}

console.log(JSON.stringify(process.memoryUsage()));
//await run(480, config.transparent['1x1']);
//await run(480, config.white['1x1']);
//await run(600, config.transparent['2x2']);
//await run(600, config.white['2x2']);
await run(20, config["1.5x1.5"]);
console.log(JSON.stringify(process.memoryUsage()));
db.write();
console.log(JSON.stringify(process.memoryUsage()));
