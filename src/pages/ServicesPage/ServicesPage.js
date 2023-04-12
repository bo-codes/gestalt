import SplitText from '../../Components/SplitText/SplitText';
import designImg from '../../images/design.jpg'
import modelingImg from '../../images/modeling.jpg'
import siteAnalysisImg from '../../images/site_analysis.jpg'
import "./ServicesPage.css";

const services = [
  {
    name: "Site Analysis",
    serviceList: [
      "Cost Estimating",
      "Site Utilization/Phase Planning",
      "3D Coordination",
    ],
    img: siteAnalysisImg,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur!",
  },
  {
    name: "Design",
    serviceList: ["Design Reviews", "Design Authoring"],
    img: designImg,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur!",
  },
  {
    name: "Modeling",
    serviceList: [
      "Existing Conditions Modeling",
      "Construction Modeling",
      "Record Modeling",
      "Asset Management",
    ],
    img: modelingImg,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit, tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit, quia. Quo neque error repudiandae fuga? Ipsa laudantium molestias eos sapiente officiis modi at sunt excepturi expedita sint? Sed quibusdam recusandae alias error harum maxime adipisci amet laborum. Perspiciatis minima nesciunt dolorem! Officiis iure rerum voluptates a cumque velit quibusdam sed amet tempora. Sit laborum ab, eius fugit doloribus tenetur fugiat, temporibus enim commodi iusto libero magni deleniti quod quam consequuntur!",
  },
];

const ServicesPage = () => {
  return (
    <div id="service-page-container">
      <div id="services">
        {services.map((service, i) => {
            return i % 2 === 0 ? (
              <div className="service" key={i}>
                <div className="service-text-body">
                  <div className="service-name">{service.name}</div>
                  <div className="service-desc">
                    <SplitText text={service.desc} />
                  </div>
                </div>
                <div
                  className="service-img"
                  style={{ backgroundImage: `url(${service.img})` }}
                ></div>
              </div>
            ) : (
              <div className="service" key={i}>
                <div
                  className="service-img"
                  style={{ backgroundImage: `url(${service.img})` }}
                ></div>
                <div className="service-text-body">
                  <div className="service-name">{service.name}</div>
                  <div className="service-desc">
                    <SplitText text={service.desc}/>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
