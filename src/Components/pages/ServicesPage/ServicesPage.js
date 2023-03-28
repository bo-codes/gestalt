import "./ServicesPage.css";

const services = [
  {
    name: "Site Analysis",
    serviceList: [
      "Cost Estimating",
      "Site Utilization/Phase Planning",
      "3D Coordination",
    ],
  },
  {
    name: "Design",
    serviceList: ["Design Reviews", "Design Authoring"],
  },
  {
    name: "Modeling",
    serviceList: [
      "Existing Conditions Modeling",
      "Construction Modeling",
      "Record Modeling",
      "Asset Management",
    ],
  },
];

const ServicesPage = () => {
  return (
    <div id="service-page-container">
      <div id="services">
        {services.map((service) => {
          return (
            <div className="service">
              <div>{service.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default ServicesPage;
