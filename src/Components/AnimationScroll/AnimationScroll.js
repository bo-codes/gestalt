import React, { useRef, useEffect } from "react";
import lottie from "lottie-web";

function AnimationScroll() {
  const animationRef = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: "https://assets5.lottiefiles.com/packages/lf20_owg7kezi.json", // Change to your animation file path
    });

    const handleScroll = () => {
      const { top } = animationRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (top < windowHeight) {
        anim.play();
      } else {
        anim.pause();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <div ref={animationRef}></div>;
}

export default AnimationScroll;
