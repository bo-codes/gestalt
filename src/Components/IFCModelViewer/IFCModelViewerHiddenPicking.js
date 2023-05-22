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

// IMPORTS FOR HIDING
import {
  IFCWALLSTANDARDCASE,
  IFCWALL,
  IFCSLAB,
  IFCBUILDINGELEMENTPROXY,
  IFCROOF,
  IFCMEMBER,
  IFCBEAM,
  IFCPLATE,
  IFCRAILING,
  IFCDOOR,
  IFCCOLUMN,
  IFCSTAIRFLIGHT,
  IFCFURNISHINGELEMENT,
} from "web-ifc";

import organizedTypes from "./IFCTypes";

import styled from "styled-components";

// import './IFCModelViewer.css'

const Progress = styled.div`
  display: flex;
`;

const IFCModelViewerHiddenPicking = ({ ifcFile }) => {
  // STATE THAT HOLDS PROGRESS TO DISPLAY
  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currSelected, setCurrSelected] = useState()

  // REF TO DOM ELEMENT WHERE WE WILL RENDER
  const containerRef = useRef(null);

  const categories = [
    ["IFCWALLSTANDARDCASE",IFCWALLSTANDARDCASE],
    ["IFCWALL",IFCWALL],
    ["IFCSLAB",IFCSLAB],
    ["IFCBUILDINGELEMENTPROXY",IFCBUILDINGELEMENTPROXY],
    ["IFCROOF",IFCROOF],
    ["IFCMEMBER",IFCMEMBER],
    ["IFCBEAM",IFCBEAM],
    ["IFCRAILING",IFCRAILING],
    ["IFCDOOR",IFCDOOR],
    ["IFCCOLUMN",IFCCOLUMN],
    ["IFCSTAIRFLIGHT",IFCSTAIRFLIGHT],
    ["IFCPLATE",IFCPLATE],
    ["IFCFURNISHINGELEMENT",IFCFURNISHINGELEMENT],
  ];

  // let currModel;
  const ifcModels = [];

  // ON EACH RENDER
  useEffect(() => {
    let containerRef2 = containerRef.current;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.z = 65;
    camera.position.y = 20;
    camera.position.x = -48;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // LIGHT
    const ambLight = new THREE.AmbientLight();
    scene.add(ambLight);

    // GRIDS & AXES
    const grid = new THREE.GridHelper(50, 30);
    scene.add(grid);
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 1;
    scene.add(axes);

    // ORBIT CONTROLS
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


    // currModel = loadModel();
    const loadModel = () => {
      ifcLoader.load(
        ifcFile,
        async (model) => {
          ifcModels.push(model);
          const tree = await ifcLoader.ifcManager.getSpatialStructure(0);
          const floors = tree.children[0].children[0].children;

          const calcUniqueTypes = (arr) => {
            const unique = [];
            for (let j = 0; j < arr.length; j++) {
              let currFloor = arr[j];

              const values = Object.values(currFloor.children);
              for (let i = 0; i < values.length; i++) {
                let currType = values[i];
                if (currType && !unique.includes(currType.type)) {
                  unique.push([currType.type, organizedTypes[currType.type]]);
                }
              }
            }
            return unique;
          };
          const uniqueTypes = calcUniqueTypes(floors);
          // console.log(uniqueTypes)
          await setupAllCategories();
          renderer.render(scene, camera);
        },
        (event) => {
          const percent = (event.loaded / event.total) * 100;
          const result = Math.trunc(percent);
          setProgress(result);
          setModelLoaded(true)
        },
        (err) => console.log(err)
      );
    }

    if (ifcFile) {
      loadModel()
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
      return raycaster.intersectObjects(scene.children);
    }

    async function pick(event) {
      const found = cast(event)[0];
      if (found) {
        const index = found.faceIndex;
        const geometry = found.object.geometry;
        const ifc = ifcLoader.ifcManager;
        const id = ifc.getExpressId(geometry, index);
        const modelID = found.object.modelID;
        const props = await ifc.getItemProperties(modelID, id);
        console.log(JSON.stringify(props.Name.value, null, null));
        setCurrSelected(JSON.stringify(props.Name.value, null, null));
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

    // window.onmousemove = (event) =>
    //   highlight(event, preselectMat, preselectModel);

    const selectMat = new MeshLambertMaterial({
      transparent: true,
      opacity: 0.6,
      color: 0xff00ff,
      depthTest: false,
    });

    const selectModel = { id: -1 };
    window.ondblclick = (event) => highlight(event, selectMat, selectModel);
    // ------------------ CREATING SUBSET FUNCTION ------------------^^

    // // ------------------ CREATING HIDING FUNCTION ------------------vv
    async function getAll(category) {
      return await ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
    }

    async function newSubsetOfType(category) {
      const ids = await getAll(category);
      return ifcLoader.ifcManager.createSubset({
        modelID: 0,
        scene,
        ids,
        removePrevious: true,
        customID: category.toString(),
      });
    }

    const subsets = {};

    async function setupAllCategories() {
      const allCategories = categories;
      for (let i = 0; i < allCategories.length; i++) {
        const currCategory = allCategories[i][1];
        await setupCategory(currCategory);
      }
    }

    async function setupCategory(category) {
      subsets[category] = await newSubsetOfType(category);
      setupCheckBox(category);
    }

    function setupCheckBox(category) {
      const checkBox = document.getElementsByClassName(category)[0];
      checkBox.addEventListener("change", (event) => {
        const checked = event.target.checked;
        const subset = subsets[category];
        if (checked) {
          scene.add(subset);
        }
        else {
          subset.removeFromParent();
          console.log(scene);
        }
      });
    }
    // // ------------------ CREATING HIDING FUNCTION ------------------^^
    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      containerRef2.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div>
      {!modelLoaded && (
        <Progress>
          <p>Progress:</p>
          <p>{progress}</p>
          <p>%</p>
        </Progress>
      )}
      {progress === 100 && !modelLoaded && <p>Merging Geometry...</p>}
      <div
        className="checkboxes"
        style={{
          display: !modelLoaded ? "none" : "block",
          position: "absolute",
        }}
      >
        {categories.map((category, i) => {
          return (
            <div key={i} id="checkbox-container">
              <input defaultChecked className={category[1]} type="checkbox" />
              <span class="checkmark"></span>
              {category[0]}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: !modelLoaded ? "none" : "block",
          position: "absolute",
          right:'0'
        }}
      >{currSelected}</div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          display: !modelLoaded ? "none" : "block",
          // border: '1px solid red',
        }}
      ></div>
    </div>
  );
};

export default IFCModelViewerHiddenPicking;
