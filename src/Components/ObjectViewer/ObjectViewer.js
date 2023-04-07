import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ObjectLoader } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import example from "./example_3.obj";
import example1 from "./gestalt_cube_cut_1.obj";
import example1_2 from "./gestalt_cube_cut_1_2.obj";
import example2 from "./gestalt_cube_cut_2.obj";
import example3 from "./gestalt_cube_cut_3.obj";
import blenderExample from "./gestalt_cube.obj";
import blenderExample2 from "./gestalt_cube_2.obj";
import blenderExample3 from "./gestalt_cube_3.obj";
import blenderExample4 from "./gestalt_cube_4.obj";

const IfcModelViewer = ({ ifcFile }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.add(new THREE.AxesHelper(5));
    const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 2000);

    camera.position.z = -400;
    // camera.position.x = -20;
    // camera.position.y = -4;

    // const light = new THREE.PointLight();
    const ambLight = new THREE.AmbientLight(0x404040);
    scene.add(ambLight);
    // light.position.set(200.5, 70.5, 105);
    let light = new THREE.DirectionalLight();
    scene.add(light);
    let helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(360, 360);

    //Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, containerRef.current);
    // controls.addEventListener("change", () => renderer.render(scene, camera));
    // controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 4;
    controls.enablePan = false;
    controls.enableZoom = false;
    // controls.target.set(2, 2, 2);

    containerRef.current.appendChild(renderer.domElement);

    const objLoader = new OBJLoader();
    objLoader.load(blenderExample4, (model) => {
      scene.add(model);
      renderer.render(scene, camera);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      helper.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // containerRef.current.removeChild(renderer.domElement);
    };
  }, [ifcFile]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      {/* Your browser doesn't support WebGL. */}
    </div>
  );
};

export default IfcModelViewer;
