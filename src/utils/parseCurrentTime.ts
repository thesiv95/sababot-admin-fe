const parseCurrentTime = (str: string) => {
  str = str.replace(/-/g, "").trim();

  const strArray = str.split("\n");
  return strArray.map((el) => {
    if (el !== "") {
      return el.trim();
    }
  });
};

export default parseCurrentTime;
