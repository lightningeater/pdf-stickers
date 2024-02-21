import c1x1transparent from "./1x1-transparent.js";
import c1x1white from "./1x1-white-removable.js";
import c1_5x1_5 from "./1.5x1.5.js";
import c2x2transparent from "./2x2-transparent.js";
import c2x2white from "./2x2-white-removable.js";

export default {
  transparent: {
    "1x1": c1x1transparent,
    "2x2": c2x2transparent,
  },
  white: {
    "1x1": c1x1white,
    "2x2": c2x2white,
  },
  "1.5x1.5": c1_5x1_5,
};
