import "./AboutPage.css";
import aboutImg from "../../../images/about.jpg";
import loadingImg from "../../../images/gestalt.gif";
import { generateText } from "../../../utils/randomAboutGen";
import React, { useState, useEffect } from "react";

const estevanText = generateText("estevan", 52);

const used = {};

const AboutPage = () => {
  // actual in-order text
  let alph =
    "estevan is a vdc man who does vdc and other cool things. he likes doing vdc as well as vdc and not only likes it, but is good at it. he enjoys sleeping in the sink with his feet in the freezer. he also is fantastic at other things like dancing and eating ramen. Thats about everything that I know about estevan I think.";

  // in-order text split into indiv characters
  let letters = alph.split("");

  // returns paragraph with same amount of characters as the text we are going to display, but characters are random
  let randomizedAlph = (letters) => {
    const randomizedP = [];
    for (let char of letters) {
      // randomizedP.push(letters[randomCharIndex()])
      randomizedP.push("0");
    }
    return randomizedP.join("");
  };

  // returns a random index number that is within the text we are going to display
  const randomCharIndex = () => {
    return Math.floor(Math.random() * (alph.length - 0 + 1) + 0);
  };

  // keeps track of whether photo loaded/helps us set out 2s delay
  const [loading, setLoading] = useState(true);
  // this will hold the text we will be displaying in the about-desc
  const [text, setText] = useState(randomizedAlph(letters));
  // this will keep track of how many letters of the alphabet we have gone through
  const [hit45, setHit45] = useState(0);
  // this will keep track of how many letter switches we have/the scan effect
  const [hit8, setHit8] = useState(0);

  useEffect(() => {
    let alphabet = "abcdetg,hijk.lmnop'qr sufvwxyz;?-&1234567890!".split("");
    const randomFunc = () => {
      if (hit8 === 8) {
        setHit8(0);
        alphabet = alphabet.slice(hit45);
        const correctLetterToSet = alphabet[0];
        used[correctLetterToSet] = 1;
      }

      const newP = [];

      // for each character of the paragraph, if the character is in the object, don't touch it and just push it, otherwise, push a random character in its place
      for (let char of letters) {
        // if we havent stored the current char in the object, push a random character in its place
        if (used[char.toLowerCase()] !== 1) {
          newP.push(alph[randomCharIndex()]);
          // if this character is in our object, we just push the character as it is
        } else {
          newP.push(char);
        }
      }

      setText(newP.join(""));
    };

    let animationInterval;
    if (hit45 <= 45) {
      animationInterval = setInterval(() => {
        if (hit8 === 8) {
          setHit45(hit45 + 1);
          randomFunc();
        } else {
          randomFunc();
          setHit8(hit8 + 1);
        }
      }, 20);
      return () => clearInterval(animationInterval);
    }
  });

  const addChars = (textLength) => {
    let addedChars = [];
    for(let i = 0; i < 319 - textLength; i++) {
      addedChars.push('a')
    }
    return addedChars;
  }


  return (
    <>
      <div
        id="about-page-container"
        style={{ display: loading ? "none" : "block" }}
      >
        <div id="about-img-container">
          <img
            id="about-img"
            src={aboutImg}
            alt="estevan portrait"
            onLoad={() => setTimeout(() => setLoading(false), 800)}
          />
        </div>
        <div id="about-desc">
          <div id="about-name">Estevan</div>
          <div id="about-titles">VDC | BIM | 3D</div>
          {/* <a
            id="about-titles"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=estevan@gestalt3d.com&csu=Work+Inquiry"
            target="_blank"
            rel="noreferrer"
          >
            estevan@gestalt3d.com
          </a> */}
          <div id="about-text">
            {text.split("").map((char, i, arr) => {
              return <div className="text-char" key={i}>{char}</div>;
            })}
            {text.split("").length !== 319 ? (
              addChars(text.split("").length).map((char, i) => {
                return <div className="text-char" key={i}>{char}</div>;
              })
            ) : (<></>)}
          </div>
          {/* <div id="about-text">
            {estevanText.slice(0, estevanText.length / 3)}
            <br /> <br />
            {estevanText.slice(
              estevanText.length / 3,
              estevanText.length / 1.5
            )}
            <br /> <br />
            {estevanText.slice(
              estevanText.length / 1.5,
              estevanText.length / 0.75
            )}
            <br /> <br />
            {estevanText.slice(estevanText.length / 0.75, estevanText.length)}
          </div> */}
        </div>
      </div>
      <div id="loading-screen" style={{ display: loading ? "flex" : "none" }}>
        <div
          id="loading-gif"
          style={{ backgroundImage: `url(${loadingImg}` }}
        ></div>
      </div>
    </>
  );
};

export default AboutPage;

// this function creates the entire paragraph.
// each second, the paragraph is iterated through, and each character is assigned different character
// how do we keep track of which characters are the correct characters now: store their indexes in an object when we set the paragraph each time
// each time the paragraph is about to be iterated through again to created the new paragraph, it checks if the index it is currently changing is in the object,
// if it is in the pbject, it just continues to the next char
// if the object has all chracters from  alph, clearInterval

// for each character, push the character to a new arr so we can store a new str while still having access to the old one to reference to.

// set an interval, while that interval is running, keep scanning letters
// once the interval is finished, display the correct letter.

// is aco t on mdtiiviu da reioe iudva.hotios eictavno suod nti aweahuchv ntekslo d.otwithsgint ewiaouvgeofi gaht i.etieghsinl h atj t.stIhie e snaokslhoo k eyimhcf g.i ntnenno nlt iotssdattenIent h deta ds n t svaysl relowkn ssndueetedodI beoonz we boa. at iheoki hyniinlnales,jnatsnw eo n vIleoht.na tateTteiwe n

// ovnava goklaee o aeaaedTvae eco aIbhie iksoihsond o ei n feebteng knh ihanie hadaob wsia eaTvuent szik, tldieet de dcean ai ton he iyanrtdehkdhayeclwaIvk angosattityvsdihnfh,tegntkgsethhvrasiet ejhaina td aaast jn r yaoim Te ciaeniwIeaid rak oa. aaemte vaeh atehoo tdtys hbedcdaklr iaeaoah ag t a ad t a.gdsn
