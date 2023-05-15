import IfcModelViewer from '../../Components/IFCModelViewer/IFCModelViewer';
import IFCModelViewerHiddenPicking from '../../Components/IFCModelViewer/IFCModelViewerHiddenPicking';
import IFCModelViewerAutoV2 from '../../Components/IFCModelViewer/IFCModelViewerAutoV2';
import exampleFile from "./MOB_UPDATED_IFC.ifc";
import './WorkPage.css'

const WorkPage = () => {
  return (
    <div>
      <IFCModelViewerHiddenPicking ifcFile={exampleFile} />
    </div>
  );
}

export default WorkPage;
