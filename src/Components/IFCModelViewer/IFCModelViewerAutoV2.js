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

// MISC IMPORTS
// import { uniqueTypes } from "./ifcdata";
import styled from "styled-components";

const Progress = styled.div`
  display: flex;
`;

const IFCModelViewerAutoV2 = ({ ifcFile }) => {
  // STATE THAT HOLDS PROGRESS TO DISPLAY
  const [progress, setProgress] = useState(0);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [ifcCategories, setIfcCategories] = useState(false);
  const [currentModel, setCurrentModel] = useState();

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
    camera.position.z = 65;
    camera.position.y = 20;
    camera.position.x = -48;

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
        async (model) => {
          let uniqueTypes;
          if (!ifcCategories) {
            const tree = await ifcLoader.ifcManager.getSpatialStructure(0);
            const floors = tree.children[0].children[0].children;

            const calcUniqueTypes = (arr) => {
              const unique = {};
              for (let j = 0; j < arr.length; j++) {
                let currFloor = arr[j];

                const values = Object.values(currFloor.children);
                for (let i = 0; i < values.length; i++) {
                  let currType = values[i];
                  if (
                    currType &&
                    !(unique[currType.type])
                  ) {
                    unique[currType.type] = [currType.type, organizedTypes[currType.type]]
                  }
                }
              }
              return unique;
            };
            uniqueTypes = calcUniqueTypes(floors);
            setIfcCategories(Object.values(uniqueTypes));
          }
          if (ifcCategories) {
            await setupAllCategories(Object.values(ifcCategories));
          }
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

    async function pick(event) {
      const found = cast(event)[0];
      if (found) {
        const index = found.faceIndex;
        const geometry = found.object.geometry;
        const ifc = ifcLoader.ifcManager;
        const id = ifc.getExpressId(geometry, index);
        const modelID = found.object.modelID;
        const props = await ifc.getItemProperties(modelID, id);
        console.log(JSON.stringify(props, null, 2));
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

    // // ------------------ CREATING HIDING FUNCTION ------------------vv

    // Gets the IDs of all the items of a specific category
    async function getAll(category) {
      return await ifcLoader.ifcManager.getAllItemsOfType(0, category, false);
    }

    // Creates a new subset containing all elements of a category
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

    // Stores the created subsets
    const subsets = {};

    async function setupAllCategories(categories) {
      const allCategories = categories;
      for (let i = 0; i < allCategories.length; i++) {
        const currCategory = allCategories[i][1];
        await setupCategory(currCategory);
      }
    }

    // Creates a new subset and configures the checkbox
    async function setupCategory(category) {
      subsets[category] = await newSubsetOfType(category);
      setupCheckBox(category);
    }

    // Sets up the checkbox event to hide / show elements
    async function setupCheckBox(category) {
      const checkBox = document.getElementsByClassName(category)[0];
      checkBox.addEventListener("change", (event) => {
        const checked = event.target.checked;
        const subset = subsets[category];
        if (checked) scene.add(subset);
        else subset.removeFromParent();
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
  },[]);

  return (
    <>
      {progress !== 100 && (
        <Progress>
          <p>Progress:</p>
          <p>{progress}</p>
          <p>%</p>
        </Progress>
      )}
      {!modelLoaded && <p>Merging Geometry...</p>}
        <div className="checkboxes">
          {ifcCategories && ifcCategories.map((category, i) => {
            return (
              <div key={i}>
                <input
                  defaultChecked
                  className={category[1]}
                  type="checkbox"
                />
                {category[0]}
              </div>
            );
          })}
          {/* {ifcCategories} */}
          {/* <div>
            <input
              defaultChecked
              className={IFCWALLSTANDARDCASE + " " + IFCWALL}
              type="checkbox"
            />
            Walls
          </div>
          <div>
            <input defaultChecked className={IFCSLAB} type="checkbox" />
            Slabs
          </div>
          <div>
            <input defaultChecked className={IFCROOF} type="checkbox" />
            Roofs
          </div>
          <div>
            <input defaultChecked className={IFCBEAM} type="checkbox" />
            Beams
          </div>
          <div>
            <input defaultChecked className={IFCCOLUMN} type="checkbox" />
            Columns
          </div>
          <div>
            <input defaultChecked className={IFCMEMBER} type="checkbox" />
            Member
          </div>
          <div>
            <input
              defaultChecked
              className={IFCBUILDINGELEMENTPROXY}
              type="checkbox"
            />
            MISC
          </div>
          <div>
            <input defaultChecked className={IFCDOOR} type="checkbox" />
            Doors
          </div>
          <div>
            <input defaultChecked className={IFCSTAIRFLIGHT} type="checkbox" />
            Stairs
          </div>
          <div>
            <input defaultChecked className={IFCRAILING} type="checkbox" />
            Railings
          </div>
          <div>
            <input defaultChecked className={IFCPLATE} type="checkbox" />
            Curtain Wall Plates
          </div>
          <div>
            <input defaultChecked className={IFCFURNISHINGELEMENT} type="checkbox" />
            Furnishing Elements
          </div> */}
        </div>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          visibility: !modelLoaded ? "none" : "block",
        }}
      ></div>
    </>
  );
};

export default IFCModelViewerAutoV2;
