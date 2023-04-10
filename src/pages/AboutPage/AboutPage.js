import "./AboutPage.css";
import aboutImg from "../../images/about.jpg";
import loadingImg from "../../images/gestalt.gif";
import TextScan from "../../Components/TextScan/TextScan"
import React, { useState } from "react";

const AboutPage = () => {

  const alph =
    "Estevan is a vdc man who does vdc and other cool things. he likes doing vdc as well as vdc and not only likes it, but is good at it. He enjoys sleeping in the sink with his feet in the freezer. He also is fantastic at other things like dancing and eating ramen. Thats about everything that I know about estevan I think.";

  // keeps track of whether photo loaded/helps us set out 2s delay
  const [loading, setLoading] = useState(true);

  const lorem =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur! Commodi minima excepturi repudiandae velit hic maxime doloremque. Quaerat provident commodi consectetur veniam similique ad earum omnis ipsum saepe, voluptas, hic voluptates pariatur est explicabo fugiat, dolorum eligendi quam cupiditate excepturi mollitia maiores labore suscipit quas? Nulla, placeat. Voluptatem quaerat non architecto ab laudantium modi minima sunt esse temporibus sint culpa, recusandae aliquam numquam totam ratione voluptas quod exercitationem fuga. Possimus quis earum veniamquasi aliquam eligendi, placeat qui corporis!";

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
          {!loading && (
            <TextScan inText={alph} scanStyle={'alph'} fontSize={'13px'} style={'default'} animationSpeed={5}/>
          )}

          <div id="about-text-2">
            {lorem.slice(0, lorem.length / 3)}
            <br /> <br />
            {lorem.slice(lorem.length / 3, lorem.length / 1.5)}
            <br /> <br />
            {lorem.slice(lorem.length / 1.5, lorem.length / 0.75)}
            <br /> <br />
            {lorem.slice(lorem.length / 0.75, lorem.length)}
          </div>
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
