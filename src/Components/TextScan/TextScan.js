import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./TextScan.css";

const Character = styled.div`
  width: 12px;
  display: flex;
  justify-content: center;
`;

const FadedCharacter = styled(Character)`
  opacity: 36%;
`;

let used = {};

const TextScan = ({value, scanStyle}) => {
  // actual in-order text

  // in-order text split into indiv characters
  let letters = value.split("");

  // returns paragraph with same amount of characters as the text we are going to display, but characters are random
  let randomizedAlph = (letters) => {
    const randomizedP = [];
    let i = 0;
    while (i < letters.length) {
      randomizedP.push(letters[randomCharIndex()]);
      i++
    }
    return randomizedP.join("");
  };

  // returns a random index number that is within the text we are going to display
  const randomCharIndex = () => {
    return Math.floor(Math.random() * (value.length - 0 + 1) + 0);
  };

  // this will hold the text we will be displaying in the about-desc
  const [text, setText] = useState(randomizedAlph(letters));
  // this will keep track of how many letters of the uniqueChars we have gone through
  const [hitUniqueChars, setHitUniqueChars] = useState(0);
  // this will keep track of how many letter switches we have/the scan effect
  const [hit8, setHit8] = useState(0);

  const getUniqueChars = (str) => {
    let arr = [];
    for (let char of str.split('')) {
      if (arr.indexOf(char) < 0) {
        arr.push(char)
      }
    }
    return arr
  }

  useEffect(() => {
    let uniqueChars = getUniqueChars(value);
    const randomFunc = () => {
      if (hit8 === 8) {
        setHit8(0);
        uniqueChars = uniqueChars.slice(hitUniqueChars);
        const correctLetterToSet = uniqueChars[0];
        used[correctLetterToSet] = 1;
      }

      const newP = [];

      // for each character of the paragraph, if the character is in the object, don't touch it and just push it, otherwise, push a random character in its place
      for (let i = 0; i < letters.length; i++) {
        let char = letters[i];
        // if we havent stored the current char in the object, push a random character in its place
        if (used[char.toLowerCase()] !== 1) {
          if (scanStyle === 'digit') {
            // USING 0 AND 8 AS THE RANDOM CHARS FOR THE SCAN
            if(i % 2 === 0) {
              newP.push('0');
            } else {
              newP.push('8')
            }
          }
          if (scanStyle === 'alph') {
            // USING AN ACTUAL RANDOM CHAR FROM THE TEXT AS THE RANDOM CHARS FOR THE SCAN
            newP.push(value[randomCharIndex()]);
          }

          // if this character is in our object, we just push the character as it is
        } else {
          newP.push(char);
        }
      }

      setText(newP.join(""));
    };

    let animationInterval;
    if (hitUniqueChars <= uniqueChars.length) {
      animationInterval = setInterval(() => {
        if (hit8 === 8) {
          setHitUniqueChars(hitUniqueChars + 1);
          randomFunc();
        } else {
          randomFunc();
          setHit8(hit8 + 1);
        }
      }, 5);
      return () => clearInterval(animationInterval);
    }
    return () => (used = {});
  });

  const addChars = (textLength) => {
    let addedChars = [];
    for (let i = 0; i < value.length - textLength; i++) {
      addedChars.push("a");
    }
    return addedChars;
  };

  return (
    <div id="about-text">
      {text.split("").map((char, i, arr) => {
          return used[char] ? (
            <Character key={i}>
              {char}
            </Character>
          ):(
            <FadedCharacter key={i}>
              {char}
            </FadedCharacter>
          )
        }
      )}
      {text.split("").length !== value.length ? (
        addChars(text.split("").length).map((char, i) => {
          return (
            <Character key={i}>
              {char}
            </Character>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default TextScan;
