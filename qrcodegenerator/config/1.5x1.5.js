const config = {
  width: 300,
  height: 300,
  type: "svg",
  margin: 10,
  qrOptions: {
    typeNumber: "0",
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  dotsOptions: {
    type: "square",
    color: "#000000",
    gradient: null,
  },
  backgroundOptions: {
    color: "transparent",
  },
  cornersSquareOptions: {
    type: "square",
    color: "#000000",
  },
  cornersDotOptions: {
    type: "square",
    color: "#000000",
  },
};
export default config;
