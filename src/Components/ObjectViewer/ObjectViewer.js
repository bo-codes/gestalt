import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ObjectLoader } from "three";
import { OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import example from "./example_3.obj"
import example1 from "./gestalt_cube_cut_1.obj"
import example2 from "./gestalt_cube_cut_2.obj"
import example3 from "./gestalt_cube_cut_3.obj"

const IfcModelViewer = ({ ifcFile }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const light = new THREE.PointLight();
    light.position.set(200.5, 70.5, 105);
    scene.add(light);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, containerRef.current);
    controls.enableDamping = true;
    controls.target.set(-2, 0, 0);

    containerRef.current.appendChild(renderer.domElement);

    const objLoader = new OBJLoader();
    objLoader.load(example2, (model) => {
      scene.add(model);
      renderer.render(scene, camera);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      containerRef.current.removeChild(renderer.domElement);
    };
  }, [ifcFile]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      Your browser doesn't support WebGL.
    </div>
  );
};

export default IfcModelViewer;
