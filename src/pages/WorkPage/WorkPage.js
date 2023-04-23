import IfcModelViewer from '../../Components/IFCModelViewer/IFCModelViewer';
import exampleFile from "./MOB_IFC_2.ifc";
import './WorkPage.css'

const WorkPage = () => {
  return (
    <div>
      <IfcModelViewer ifcFile={exampleFile} />
    </div>
  )
}

export default WorkPage;
