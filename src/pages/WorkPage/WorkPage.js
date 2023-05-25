import IfcModelViewer from '../../Components/IFCModelViewer/IFCModelViewer';
import IFCModelViewerAutoV2 from '../../Com;;;;;;ponents/IFCModelViewer/IFCModelViewerAutoV2';
import IFCModelViewerHiddenPicking from '../../Components/IFCModelViewer/IFCModelViewerHiddenPicking';
import exampleFile from "./MOB_UPDATED_IFC.ifc";
import './WorkPage.css'

const WorkPage = () => {
  return (
    <div id='workpage-container'>
      <IFCModelViewerHiddenPicking ifcFile={exampleFile} />
    </div>
  );
}

export default WorkPage;

// STEPS FOR MODEL PROCESSING/LOADING

// MODEL LOADING
/*
ifcFile
ifcLoader(new IFCLoader())

*/
