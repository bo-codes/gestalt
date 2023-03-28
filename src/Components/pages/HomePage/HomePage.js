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

  const [hit8, setHit8] = useState(0);

  const randomCharIndex = () => {
    return Math.floor(Math.random() * (alph.length - 0 + 1) + 0);
  };

  const calcText = (fullText) => {
    return fullText.slice(0, timeNumber);
  };

  useEffect(() => {
    let animationInterval;
    animationInterval = setInterval(() => {
      setAnimationDone(!animationDone);
    }, 4200);
    return () => clearInterval(animationInterval);
  });

  useEffect(() => {
    let gestaltInterval;
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

      const stopAnimation = () => {
        setTimeText(completeText);
        setRandomChar("");
        setTimeNumber(completeText.length + 1);
        document.removeEventListener("click", stopAnimation);
        document.removeEventListener("keypress", stopAnimation);
      };
      document.addEventListener("click", stopAnimation);
      document.addEventListener("keypress", stopAnimation);
      return () => {
        clearInterval(gestaltInterval);
      };
    }
  });

  return (
    <div id="main-div-coming-soon">
      <div id="gestalt-text">
        <div id="coming-soon-gestalt-text">{timeText}</div>
        <span id="coming-soon-random-char">{randomChar}</span>
      </div>
    </div>
  );
}
