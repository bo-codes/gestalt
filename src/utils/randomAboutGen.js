const randomNumGen = () => {
  return Math.floor(Math.random() * (6 + 1) + 1);
};
const generateText = (name, num) => {
  let finalStr = "";

  for (let i = 0; i < num; i++) {
    let currRepeats = randomNumGen();
    for (let j = 0; j < currRepeats; j++) {
      finalStr += "blah ";
    }
    finalStr += `${name} `;
  }
  return finalStr;
};

export { generateText };
