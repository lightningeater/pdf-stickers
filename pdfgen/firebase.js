import admin from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { LowSync, JSONFileSync } from "lowdb";
const adapter = new JSONFileSync("../db.json");
const db = new LowSync(adapter);

const App = initializeApp({
  credential: admin.credential.cert("sticflic-mvp-firebase-adminsdk.json"),
});

export default App;

export const firestore = getFirestore(App);

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

function getCodes() {
  db.read();
  db.data = db.data || { usedQrCodes: [] };
  const codes = [];
  for (const format in db.data.usedQrCodes) {
    codes.push(
      ...db.data.usedQrCodes[format].map(({ code, qrcode }) => ({
        code,
        qrcode,
        format,
        generated: Timestamp.now(),
        version: 0.2,
      }))
    );
  }
  return codes;
}

async function runBatch(codes) {
  // Get a new write batch
  const batch = firestore.batch();
  for (const code of codes) {
    const codeRef = firestore.collection("codes").doc(code.code);
    await batch.create(codeRef, code);
  }
  return batch.commit().then((results) => results.length);
}

async function storeCodes() {
  try {
    const codes = getCodes();
    const batches = [...chunks(codes, 500)];
    let successes = 0;
    console.log(
      `There are ${batches.length} batches, with a total of ${codes.length}`
    );
    for (const batch of batches) {
      successes += await runBatch(batch);
    }
    return `Success! Created ${successes} codes.`;
  } catch (e) {
    throw e;
  }
}
/*
async function xstoreCodes() {
  try {
    db.read();
    db.data = db.data || { usedQrCodes: [] };
    const response = await firestore.runTransaction(async (t) => {
      let count = 0;
      for (const format in db.data.usedQrCodes) {
        const codes = db.data.usedQrCodes[format];
        for (const { code, qrcode } of codes) {
          const codeRef = firestore.collection("codes").doc(code);
          await t.create(codeRef, {
            code,
            qrcode,
            format,
            generated: Timestamp.fromDate(new Date("07/18/2022 02:52:49 PM")),
            version: 0.1,
          });
          count++;
        }
      }
      return count;
    });
    return `Transaction success! Created ${response} codes.`;
  } catch (e) {
    throw e;
  }
}
*/
storeCodes().then(console.log).catch(console.error);
