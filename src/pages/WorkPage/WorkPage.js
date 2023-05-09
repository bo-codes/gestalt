import IfcModelViewer from '../../Components/IFCModelViewer/IFCModelViewer';
import exampleFile from "./MOB_UPDATED_IFC.ifc";
import './WorkPage.css'

const WorkPage = () => {
  return (
    <div>
      <IfcModelViewer ifcFile={exampleFile} />
    </div>
  )
}

export default WorkPage;
