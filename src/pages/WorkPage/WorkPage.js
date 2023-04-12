import IfcModelViewer from '../../Components/IFCModelViewer/IFCModelViewer';
import exampleFile from "./example2.ifc"
import './WorkPage.css'

const WorkPage = () => {
  return (
    <div>
      <IfcModelViewer ifcFile={exampleFile} />
    </div>
  )
}

export default WorkPage;
