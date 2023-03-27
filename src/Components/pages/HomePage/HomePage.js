import React, { useState, useEffect } from "react";
import "./HomePage.css";

export default function HomePage() {
  const completeText = "GESTALT 3D TECHNOLOGIES";
  const alph = completeText.split(" ").join().split("");

  // we increment this number on each iteration of the interval and use this number to know up to which index we should slice the completText
  const [timeNumber, setTimeNumber] = useState(0);

  // calculated slice of completeText
  const [timeText, setTimeText] = useState("");

  // random character index from the completeText set using randomCharIndex
  const [randomChar, setRandomChar] = useState(0);

  const [animationDone, setAnimationDone] = useState(false);
  // const [gestaltDone, setGestaltDone] = useState(0);
  const [hit8, setHit8] = useState(0);

  //
  const randomCharIndex = () => {
    return Math.floor(Math.random() * (alph.length - 0 + 1) + 0);
  };

  const calcText = (fullText) => {
    return fullText.slice(0, timeNumber);
  };

  // calculates the snippet we want of the email text
  // const secondCalcText = (fullText) => {
  //   return fullText.slice(0, secondTimeNumber);
  // };

  // calculates the amount of time it should take to type the next letter of the email. We want it to be irregular, that's why
  // const calcTypeTimer = () => {
  //   return Math.floor(Math.random() * (350 - 50 + 1) + 50);
  // };

  useEffect(() => {
    let animationInterval;
    animationInterval = setInterval(() => {
      setAnimationDone(!animationDone);
    }, 4200);
    return () => clearInterval(animationInterval);
  });

  // useEffect(() => {
  //   // if the completeText is completely populated, then set gestaltDone to be truthy so that the "coming soon" text can start animating
  //   // this is just a slight delay between the finish of the gestalt text and the coming soon text because the animations are too close together otherwise
  //   if (timeNumber > completeText.length) {
  //     let firstDelayInterval;
  //     firstDelayInterval = setInterval(() => {
  //       setGestaltDone(1);
  //     }, 400);
  //     return () => clearInterval(firstDelayInterval);
  //   }
  // }, [timeNumber, completeText]);

  useEffect(() => {
    let gestaltInterval;
    // let scanTextInterval;
    if (timeNumber <= completeText.length) {
      gestaltInterval = setInterval(() => {
        setRandomChar(alph[randomCharIndex()]);
        if (hit8 === 8) {
          setTimeNumber(timeNumber + 1);
          setTimeText(calcText(completeText));
          setHit8(0);
          if (timeNumber === completeText.length) setRandomChar("");
        } else setHit8(hit8 + 1);
      }, 30);
      return () => {
        // clearInterval(scanTextInterval);
        clearInterval(gestaltInterval);
      };
    }
    // if (animationDone) {
    //   if (timeNumber > completeText.length) {
    //     let secondInterval;
    //     if (secondTimeNumber <= completeText2.length + 1) {
    //       secondInterval = setInterval(() => {
    //         // console.log(alph.length);
    //         setCursorVis("visible");
    //         setSecondTimeNumber(secondTimeNumber + 1);
    //         setSecondTimeText(secondCalcText(completeText2));
    //       }, calcTypeTimer());
    //       return () => clearInterval(secondInterval);
    //     } else {
    //       let thirdInterval;
    //       if (secondTimeNumber >= completeText2.length) {
    //         thirdInterval = setInterval(() => {
    //           // console.log("bobo");
    //           if (cursorVis === "visible") setCursorVis("hidden");
    //           else setCursorVis("visible");
    //         }, 650);
    //       }
    //       return () => clearInterval(thirdInterval);
    //     }
    //   }
    // }
  });

  return (
    <div id="main-div-coming-soon">
      <div id="gestalt-text">
        <div id="coming-soon-gestalt-text">{timeText}</div>
        <span id="coming-soon-random-char">
          {/* {String.fromCodePoint(parseInt(randomChar, 16))} */}
          {randomChar}
        </span>
      </div>
      {/* {gestaltDone ? (
          <div id="coming-soon-text" className="neon-text">
            coming soon
          </div>
        ) : (
          <div id="coming-soon-text-placeholder"></div>
        )}
        <div id="email-text-and-cursor">
          {animationDone && (
            <span>
              <img src={envelopeImg} id="email-symbol" alt="envelope-icon" />
            </span>
          )}
          <span id="email-text">{secondTimeText}</span>
          <span id="email-cursor" style={{ visibility: `${cursorVis}` }}>
            |
          </span>
        </div> */}
    </div>
  );
}
