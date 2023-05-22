import React, { useState, useEffect } from "react";
import ThreeFileViewer from "../../Components/ObjectViewer/ObjectViewer";
import $ from "jquery";
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
    const formatCircle = () => {
      const text = document.getElementById("circle-text");
      text.innerHTML = text.textContent.replace(/\S/g, "<span class='circle-char'>$&</span>");
      const ele = document.querySelectorAll('.circle-char');
      for (let i = 1; i < ele.length; i++) {
        ele[i].style.transform = "rotate(" + i * 365/ele.length + "deg)";
      }
    };
    formatCircle();
    $(document).ready(function () {
      $(document.getElementById("three-container")).mousemove(function (e) {
        $("#circle-text").css({ left: e.offsetX - 25, top: e.offsetY - 17 });
        $(".circle-char").css({ animation: "scopeFocus 1s forwards" });
        e.stopPropagation();
      });
      $(document.getElementById("cube-container")).mouseleave(function (e) {
        // console.log('mouseleave')
        // $("#circle-text").css({
        //   left: " -5%",
        //   top: " 43%",
        // });
        $("#circle-text").animate(
          {
            left: "-5%",
            top: "43%",
          },
          1000,
          function () {
            // Animation complete.
          }
        );

        // $(".circle-char").css({
        //   "transform-origin": "200px",
        //   animation: "none"
        //   // animation: "scopeUnfocus 1s forwards",
        // });
        $(".circle-char").css({ animation: "scopeUnfocus 1s forwards" });
      });
    });
  }, []);

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
        // setTimeText(completeText)
        // setTimeNumber(completeText.length + 1);
        // setRandomChar('')
        setAnimationDone(true);
        document.removeEventListener("click", stopAnimation);
        document.removeEventListener("keypress", stopAnimation);
      };
      document.addEventListener("click", stopAnimation);
      document.addEventListener("keypress", stopAnimation);
      return () => {
        clearInterval(gestaltInterval);
      };
    }

    // const hoverFocus = () => {
    //   $(document).mousemove(function (e) {
    //     $("#circle-text").css({ left: e.pageX, top: e.pageY });
    //     $(".circle-char").css({ "transform-origin": '20px' });
    //   });
    // }

    return () => {
      setAnimationDone(false);
    }
  });

  return (
    <div id="main-div-coming-soon">
      <div id="gestalt-home-title">
        <h1 id="gestalt-title-text">
          GESTALT <span style={{fontWeight: '300'}}>3D TECHNOLOGIES</span>
        </h1>
        <p id="gestalt-title-p">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
          mollitia, molestiae quas vel sint commodi repudiandae consequuntur
          voluptatum laborum numquam blanditiis harum quisquam eius sed odit
          fugiat iusto fuga praesentium optio, eaque rerum! Provident similique
          accusantium nemo autem. Veritatis
        </p>
      </div>
      <div id="cube-container">
        <h1 id="circle-text">G3T</h1>
        <div id="three-container-container">
          <div id="circle-boundary"></div>
          <div
            id="three-container"
            // onMouseEnter={() => {
            //   console.log('enter')
            //   $(document).mousemove(function (e) {
            //     $("#circle-text").css({ left: e.offsetX, top: e.offsetY - 28 });
            //     $(".circle-char").css({ "transform-origin": "0 20px" });
            //   });
            // }}
            // onMouseLeave={() => {
            //   console.log('leave')
            //   $(document).mousemove(function () {
            //     $("#circle-text").css({ left:" 52%", top:" -5%" });
            //     $(".circle-char").css({ "transform-origin": "0 200px" });
            //   });
            // }}
          >
            <ThreeFileViewer />
          </div>
        </div>
      </div>
      {/* <div id="gestalt-text">
          {animationDone ? (
            <>
              <div id="coming-soon-gestalt-text">{completeText}</div>
              <span id="coming-soon-random-char">
                    {''}
                  </span>
            </>
            ) : (
              <>
                <div id="coming-soon-gestalt-text">{timeText}</div>
                <span id="coming-soon-random-char">
                  {randomChar}
                </span>
              </>
          )}
        </div> */}
    </div>
  );
}
