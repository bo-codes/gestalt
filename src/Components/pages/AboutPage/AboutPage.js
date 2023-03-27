import "./AboutPage.css";
import aboutImg from "../../../images/about.jpg";
import { generateText } from "../../../utils/randomAboutGen";

const estevanText = generateText("estevan", 52);

const AboutPage = () => {
  return (
    <div id="about-page-container">
      <div id="about-img-container">
        <img id="about-img" src={aboutImg} alt="estevan portrait" />
      </div>
      <div id="about-desc">
        <div id="about-name">Estevan</div>
        {/* <div id="about-titles">VDC | BIM | 3D</div> */}
        <a
          id="about-titles"
          href="https://mail.google.com/mail/?view=cm&fs=1&to=estevan@gestalt3d.com&csu=Work+Inquiry"
          target="_blank"
          rel="noreferrer"
        >
          estevan@gestalt3d.com
        </a>
        <div id="about-text">
          {estevanText.slice(0, estevanText.length / 3)}
          <br /> <br />
          {estevanText.slice(estevanText.length / 3, estevanText.length / 1.5)}
          <br /> <br />
          {estevanText.slice(
            estevanText.length / 1.5,
            estevanText.length / 0.75
          )}
          <br /> <br />
          {estevanText.slice(estevanText.length / 0.75, estevanText.length)}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
