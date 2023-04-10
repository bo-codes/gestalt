import React, { useState, useEffect, useRef } from "react";
import animation from '../../images/animations/dancing_skel.json'
import lottie from "lottie-web";

function ScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const animationContainer = useRef(null);
  const anim = useRef(null);

  useEffect(() => {
    anim.current = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "https://assets6.lottiefiles.com/packages/lf20_owg7kezi.json", // Change to your animation file path
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (anim.current) {
      anim.current.goToAndStop(scrollY / 5, true);
    }
  }, [scrollY]);

  return <div ref={animationContainer}></div>;
}

export default ScrollAnimation;
