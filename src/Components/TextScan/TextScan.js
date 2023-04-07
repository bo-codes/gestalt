import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./TextScan.css";


/* THE WAY THAT THIS COMPONENT WORKS IS THAT IT:
- TAKES A BODY OF TEXT
- SPLITS THE BODY OF TEXT INTO CHARS
- ITERATES THROUGH ALL THE CHARS;
    IF THE CHAR IS IN OUR 'used' OBJ, WE SHOW IT AT 100% OPACITY;
    OTHERWISE, SHOW A RANDOM CHARACTER FROM OUR BODY OF TEXT AT 36% OPACITY
 */

// BUILT-IN STYLE FOR EACH CHARACTER
const Character = styled.div`
width: 12px;
display: flex;
justify-content: center;
`;

// BUILT-IN STYLE FOR FADED CHARACTER
const FadedCharacter = styled(Character)`
  opacity: 36%;
`;

// THIS OBJ KEEPS TRACK OF LETTERS WE ARE SHOWING
// WE ADD LETTERS FROM OUR TEXT BODY TO IT
let used = {};


const TextScan = ({value, scanStyle}) => {
  // in-order text split into indiv characters
  let letters = value.split("");

  //  ------------------- SOLELY USED TO CREATE A RANDOMIZED PARAGRAPH OF LETTERS, THE SAME LENGTH AS OUR INTAKEN TEXT BODY ------------------- vv
  // returns a random index number that is within the body of text we intook
  const randomCharIndex = () => {
    return Math.floor(Math.random() * (value.length - 0 + 1) + 0);
  };

  // returns paragraph with same amount of characters as the text we are going to display, but characters are random
  let randomizedAlph = (letters) => {
    const randomizedP = [];
    let i = 0;
    while (i < letters.length) {
      randomizedP.push(letters[randomCharIndex()]);
      i++;
    }
    return randomizedP.join("");
  };
  //  ------------------- SOLELY USED TO CREATE A RANDOMIZED PARAGRAPH OF LETTERS, THE SAME LENGTH AS OUR INTAKEN TEXT BODY ------------------- ^^

  // this will hold the text we will be displaying in the about-desc
  const [text, setText] = useState(randomizedAlph(letters));
  // this will keep track of how many letters of the uniqueChars we have gone through
  const [hitUniqueChars, setHitUniqueChars] = useState(0);
  // this will keep track of how many letter switches we have/the scan effect
  const [hit8, setHit8] = useState(0);

  // THIS FUNCTION WILL TAKE THE INTAKEN TEXT BODY, AND RETURNS AN ARRAY OF UNIQUE CHARACTERS
  const getUniqueChars = (str) => {
    let arr = [];
    for (let char of str.split("")) {
      if (arr.indexOf(char) < 0) {
        arr.push(char);
      }
    }
    return arr;
  };

  useEffect(() => {
    // set uniqueChars to equal the arr of all unique chars in our body of text
    let uniqueChars = getUniqueChars(value);
    // FUNCTION THAT BASICALLY CAUSES THE ANIMATION BY UPDATING THE 'text' STATE OVER AND OVER
    const randomFunc = () => {
      // THIS IS A SORT OF BASE CASE; WHEN WE HIT THIS CASE, WE ADD A NEW CHAR TO THE 'used' OBJ HENCE RENDERING A NEW CHARACTER IN ITS CORRECT PLACE
      if (hit8 === 8) {
        // WE RESET OUR hit8 TO MAKE SURE WE WAIT A COUPLE OF RANDOM TEXT RE-RENDERS TO ADD A NEW LETTER TO THE 'used' OBJ
        setHit8(0);
        // WE SLICE THE UNIQUE CHARS AT THE LAST CHARACTER WE'VE ADDED TO THE 'used' OBJ TO ENSURE THESE ARE ALL CHARS THAT HAVEN'T BEEN RENDERED YET
        uniqueChars = uniqueChars.slice(hitUniqueChars);
        // WE GRAB THE FIRST LETTER IN OUR FRESHLY SLICED ARR OF UNIQUE CHARS.
        const correctLetterToSet = uniqueChars[0];
        // WE ADD THAT UNIQUE CHAR TO THE 'used' OBJ
        used[correctLetterToSet] = 1;
      }

      const newP = [];

      // for each character of the paragraph, if the character is in the object, don't touch it and just push it, otherwise, push a random character in its place
      for (let i = 0; i < letters.length; i++) {
        let char = letters[i];
        // if we havent stored the current char in the object, push a random character in its place
        if (used[char.toLowerCase()] !== 1) {
          if (scanStyle === "digit") {
            // USING 0 AND 8 AS THE RANDOM CHARS FOR THE SCAN
            if (i % 2 === 0) {
              newP.push("0");
            } else {
              newP.push("8");
            }
          }
          if (scanStyle === "alph") {
            // USING AN ACTUAL RANDOM CHAR FROM THE TEXT AS THE RANDOM CHARS FOR THE SCAN
            newP.push(value[randomCharIndex()]);
          }

          // if this character is in our object, we just push the character as it is in full opacity/render it
        } else {
          newP.push(char);
        }
      }

      setText(newP.join(""));
    };
    // CREATE INTERVAL
    let animationInterval;
    // If we haven't yet hit all of our uniqueChars, set the interval;
    if (hitUniqueChars <= uniqueChars.length) {
      // setInterval
      animationInterval = setInterval(() => {
        // if we have hit 8 iterations of random chars/not setting/rendering a new unique char in its correct place:
        if (hit8 === 8) {
          // increment the hitUniqueChars state because we are about to add a new unique char to the used OBJ by calling the randomFunc function
          setHitUniqueChars(hitUniqueChars + 1);
          randomFunc();
        // otherwise, just call the randomFunc which will render no new unique characters in their respective correct place
        } else {
          randomFunc();
          // make sure to increment the count8 so that after doing these random character renders 8 times, we finally add a new char from uniqueChars to the used OBJ and render it the next time we call the randomFunc function after that
          setHit8(hit8 + 1);
        }
      }, 2);
      // clear the interval each time
      return () => clearInterval(animationInterval);
    }
    return () => (used = {});
  });

  // this is just to make sure that our randomText we display is the same length as the input text body
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
        // if the char is stored in our used OBJ, render it with the "Character" styled div
        return used[char] ? (
          <Character key={i}>{char}</Character>
          ) : (
            // otherwise, render it with the "FadedCharacter" styled div
            <FadedCharacter key={i}>{char}</FadedCharacter>
        );
      })}
      {/* the jsx below just gives us extra characters in case the length of our random text does not match the length of the intaken text body */}
      {text.split("").length !== value.length ? (
        addChars(text.split("").length).map((char, i) => {
          return <Character key={i}>{char}</Character>;
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default TextScan;
