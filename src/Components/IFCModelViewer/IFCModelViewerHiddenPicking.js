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
  // IFCWALLSTANDARDCASE,
  // IFCWALL,
  // IFCSLAB,
  // IFCBUILDINGELEMENTPROXY,
  // IFCROOF,
  // IFCMEMBER,
  // IFCBEAM,
  // IFCPLATE,
  // IFCRAILING,
  // IFCDOOR,
  // IFCCOLUMN,
  // IFCSTAIRFLIGHT,
  // IFCFURNISHINGELEMENT,
  IFCFLOWTERMINAL,
  IFCBUILDINGELEMENTPROXY,
  IFCFLOWSEGMENT,
  IFCFLOWFITTING,
  IFCCOLUMN,
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCWALL,
  IFCDOOR,
  IFCCURTAINWALL,
  IFCPLATE,
  IFCMEMBER,
  IFCSTAIRFLIGHT,
  IFCSTAIR,
  IFCCOVERING,
  IFCRAILING
} from "web-ifc";

import organizedTypes from "./IFCTypes";

import styled from "styled-components";

import "./IFCModelViewer.css";

const Progress = styled.div`
  display: flex;
`;

const IFCModelViewerHiddenPicking = ({ ifcFile }) => {
  // STATE THAT HOLDS PROGRESS TO DISPLAY
  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [currSelected, setCurrSelected] = useState();

  // REF TO DOM ELEMENT WHERE WE WILL RENDER
  const containerRef = useRef(null);

  const categories = [
    ["IFCFLOWTERMINAL", IFCFLOWTERMINAL],
    ["IFCBUILDINGELEMENTPROXY", IFCBUILDINGELEMENTPROXY],
    ["IFCFLOWSEGMENT", IFCFLOWSEGMENT],
    ["IFCFLOWFITTING", IFCFLOWFITTING],
    ["IFCCOLUMN", IFCCOLUMN],
    ["IFCWALLSTANDARDCASE", IFCWALLSTANDARDCASE],
    ["IFCSLAB", IFCSLAB],
    ["IFCWALL", IFCWALL],
    ["IFCDOOR", IFCDOOR],
    ["IFCPLATE", IFCPLATE],
    ["IFCMEMBER", IFCMEMBER],
    ["IFCCURTAINWALL", IFCCURTAINWALL],
    ["IFCSTAIRFLIGHT", IFCSTAIRFLIGHT],
    ["IFCSTAIR", IFCSTAIR],
    ["IFCCOVERING", IFCCOVERING],
    ["IFCRAILING", IFCRAILING],
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
          console.log(ifcLoader.ifcManager.g, 'ifcManager')

          const getFloors = (arr) => {
            let resValues = []
            for (let j = 0; j < arr.length; j++) {
              let currFloor = arr[j];

              const values = Object.values(currFloor.children);
              resValues = [...resValues, ...values]
            }
            return resValues;
          }
          // console.log(getFloors(floors))

          const getAllTypes = (typesArr, uniques=[]) => {
            for (let currType of typesArr) {
              if (currType.children.length > 0) {
                uniques = [ ... getAllTypes(currType.children, uniques)];
              }
              if (!uniques.includes(currType.type)) {
                uniques.push(currType.type)
              }
            }
            return [...uniques]
          }
          // console.log(getAllTypes(getFloors(floors)))

          // const calcUniqueTypes = (typesArr) => {
          //     for (let i = 0; i < typesArr.length; i++) {
          //       let currType = typesArr[i];
          //       if (!uniques.includes(currType.type)) {
          //         uniques.push(currType.type);
          //       }
          //       if (currType.children.length > 0) {
          //         uniques.push(calcUniqueTypes(currType.children, uniques))
          //       }
          //       return uniques
          //     }
          //     if (queue.length > 0) {
          //       // return
          //     }
          //   return unique;
          // }
          // const uniqueTypes = calcUniqueTypes(floors);
          // console.log(uniqueTypes)
          await setupAllCategories();
          renderer.render(scene, camera);
        },
        (event) => {
          const percent = (event.loaded / event.total) * 100;
          const result = Math.trunc(percent);
          setProgress(result);
          setModelLoaded(true);
        },
        (err) => console.log(err)
      );
    };

    if (ifcFile) {
      loadModel();
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
      } else {
        setCurrSelected('')
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
    const subsets = {};

    const getFloors = (arr) => {
      let resValues = [];
      for (let j = 0; j < arr.length; j++) {
        let currFloor = arr[j];

        const values = Object.values(currFloor.children);
        resValues = [...resValues, ...values];
      }
      return resValues;
    };

    const getAllTypes = (typesArr, uniques = []) => {
      for (let currType of typesArr) {
        if (currType.children.length > 0) {
          uniques = [...getAllTypes(currType.children, uniques)];
        }
        if (!uniques.includes(currType.type)) {
          uniques.push(currType.type);
        }
      }
      return [...uniques];
    };

    async function setupAllCategories() {
      const tree = await ifcLoader.ifcManager.getSpatialStructure(0);
      const floors = tree.children[0].children[0].children;
      console.log(getFloors(floors), 'floors')
      console.log(getAllTypes(getFloors(floors)));

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

    async function getAll(category) {
      return await ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
    }

    function setupCheckBox(category) {
      const checkBox = document.getElementsByClassName(category)[0];
      checkBox.addEventListener("change", (event) => {
        const checked = event.target.checked;
        const subset = subsets[category];
        if (checked) {
          scene.add(subset);
        } else {
          subset.removeFromParent();
        }
      });
    }

    // // ------------------ CREATING HIDING FUNCTION ------------------^^
    const animate = () => {
      controls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      renderer.domElement.style = "display: block; width: 100%; height: 100%";
    };

    animate();

    return () => {
      containerRef2.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div id="entire-ifc-viewer">
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
              <span className="checkmark"></span>
              {category[0]}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: !modelLoaded ? "none" : "block",
        }}
        id="curr-selected-element"
      >
        <span
          style={{
            color: "black",
            fontWeight: "500",
          }}
        >
          Currently Selected:{" "}
        </span>
        {currSelected}
      </div>
      <div
        id="canvas-container"
        ref={containerRef}
        style={{
          display: !modelLoaded ? "none" : "block",
          // border: '1px solid red',
        }}
      ></div>
    </div>
  );
};

export default IFCModelViewerHiddenPicking;
