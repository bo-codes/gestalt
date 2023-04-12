import React, { useEffect, useRef, useState } from "react";

// IMPORTS FOR IFCLOADER
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three/IFCLoader";

// IMPORTS FOR PICKER FUNCTION
import { Raycaster, Vector2 } from "three";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

// IMPORTS FOR SUBSETS
import { MeshLambertMaterial } from "three";

// MISC IMPORTS
import styled from "styled-components";

const Progress = styled.div`
  display: flex;
`;

const IFCModelViewer = ({ ifcFile }) => {
  // STATE THAT HOLDS PROGRESS TO DISPLAY
  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);

  // REF TO DOM ELEMENT WHERE WE WILL RENDER
  const containerRef = useRef(null);

  // ON EACH RENDER
  useEffect(() => {
    let containerRef2 = containerRef.current;

    // SET SCENE UP
    const scene = new THREE.Scene();

    // SET CAMERA UP
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.z = 15;
    camera.position.y = 13;
    camera.position.x = 8;

    // SET RENDERER UP
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // ------ CREATE AN AMBIENT LIGHT
    const ambLight = new THREE.AmbientLight();
    // ------ ADD THE LIGHT TO THE SCENE
    scene.add(ambLight);

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

    // ADD THE RENDERER TO THE DOM ELEMENT
    containerRef2.appendChild(renderer.domElement);

    // NEW INSTANCE OF IFC LOADER
    const ifcLoader = new IFCLoader();
    // SETTING WASM TO MAKE SURE WE GET NO WASM ERRORS
    ifcLoader.ifcManager.setWasmPath("../../");

    // Sets up optimized picking
    ifcLoader.ifcManager.setupThreeMeshBVH(
      computeBoundsTree,
      disposeBoundsTree,
      acceleratedRaycast
    );

    const ifcModels = [];

    // IF WE HAVE A VALID IFC FILE
    if (ifcFile) {
      // START THE LOADING PROCESS
      ifcLoader.load(
        ifcFile,
        (model) => {
          ifcModels.push(model);
          scene.add(model);
          renderer.render(scene, camera);
          setModelLoaded(true);
        },
        (event) => {
          const percent = (event.loaded / event.total) * 100;
          const result = Math.trunc(percent);
          setProgress(result);
        },
        (err) => console.log(err)
      );
    }

    // ------------------ CREATING PICKER FUNCTION ------------------vv
    const raycaster = new Raycaster();
    raycaster.firstHitOnly = true;
    const mouse = new Vector2();

    function cast(event) {
      // Computes the position of the mouse on the screen
      const bounds = containerRef.current.getBoundingClientRect();

      const x1 = event.clientX - bounds.left;
      const x2 = bounds.right - bounds.left;
      mouse.x = (x1 / x2) * 2 - 1;

      const y1 = event.clientY - bounds.top;
      const y2 = bounds.bottom - bounds.top;
      mouse.y = -(y1 / y2) * 2 + 1;

      // Places it on the camera pointing to the mouse
      raycaster.setFromCamera(mouse, camera);

      // Casts a ray
      return raycaster.intersectObjects(ifcModels);
    }

    function pick(event) {
      const found = cast(event)[0];
      if (found) {
        const index = found.faceIndex;
        const geometry = found.object.geometry;
        const ifc = ifcLoader.ifcManager;
        const id = ifc.getExpressId(geometry, index);
        console.log(id);
      }
    }

    containerRef.current.ondblclick = pick;
    // ------------------ CREATING PICKER FUNCTION ------------------^^

    // ------------------ CREATING SUBSET FUNCTION ------------------vv
    // Creates subset material
    const preselectMat = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.6,
      color: 0xff88ff,
      depthTest: false,
    });

    const ifc = ifcLoader.ifcManager;

    // Reference to the previous selection
    let preselectModel = { id: -1 };

    function highlight(event, material, model) {
      const found = cast(event)[0];
      if (found) {
        // Gets model ID
        model.id = found.object.modelID;

        // Gets Express ID
        const index = found.faceIndex;
        const geometry = found.object.geometry;
        const id = ifc.getExpressId(geometry, index);

        // Creates subset
        ifcLoader.ifcManager.createSubset({
          modelID: model.id,
          ids: [id],
          material: material,
          scene: scene,
          removePrevious: true,
        });
      } else {
        // Removes previous highlight
        ifc.removeSubset(model.id, material);
      }
    }

    window.onmousemove = (event) =>
      highlight(event, preselectMat, preselectModel);

    const selectMat = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.6,
      color: 0xff00ff,
      depthTest: false,
    });

    const selectModel = { id: -1 };
    window.ondblclick = (event) => highlight(event, selectMat, selectModel);
    // ------------------ CREATING SUBSET FUNCTION ------------------^^

    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      containerRef2.removeChild(renderer.domElement);
    };
  }, [ifcFile]);

  return (
    <>
      {progress !== 100 && (
        <Progress>
          <p>Progress:</p>
          <p>{progress}</p>
          <p>%</p>
        </Progress>
      )}
      {progress === 100 && !modelLoaded && <p>Merging Geometry...</p>}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}></div>
    </>
  );
};

export default IFCModelViewer;
