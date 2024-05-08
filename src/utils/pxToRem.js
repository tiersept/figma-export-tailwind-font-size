const pxToRem = (px, base = 16) => {
  let tempPx = px;
  if (typeof px === "string" || px instanceof String)
    tempPx = tempPx.replace("px", "");

  tempPx = parseInt(tempPx);

  return (1 / base) * tempPx + "rem";
};

module.exports = pxToRem;
