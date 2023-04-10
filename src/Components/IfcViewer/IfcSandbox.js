import "./wasm/web-ifc.wasm";
import "./wasm/web-ifc-mt.wasm";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import exampleFile from "./example.ifc"

const IfcModelViewer = ({ ifcFile }) => {
  const containerRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    console.log("useeffect start");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.z = 15;
    camera.position.y = 13;
    camera.position.x = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Creates grids and axes in the scene
    const grid = new THREE.GridHelper(50, 30);
    scene.add(grid);

    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);

    //Creates the orbit controls (to navigate the scene)
    const controls = new OrbitControls(camera, containerRef.current);
    controls.enableDamping = true;
    controls.target.set(-2, 0, 0);

    containerRef.current.appendChild(renderer.domElement);

    if (exampleFile) {
      const ifcLoader = new IFCLoader();
      // ifcLoader.ifcManager.setWasmPath("src/Components/IfcViewer/wasm");
      // var ifcURL = URL.createObjectURL(exampleFile);
      // console.log(ifcURL)
      // console.log(ifcLoader.load)
      ifcLoader.load(exampleFile, (model) => {
        scene.add(model);
        renderer.render(scene, camera);
      }, () => console.log('loading model'), (err) => console.log(err));
    }

    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      // containerRef.current.removeChild(renderer.domElement);
    };
  }, [file]);

  return (
    <>
      <input
        type="file"
        onChange={handleFileChange}
        onClick={() => console.log("bobo")}
      />
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        Your browser doesn't support WebGL.
      </div>
    </>
  );
};

export default IfcModelViewer;
