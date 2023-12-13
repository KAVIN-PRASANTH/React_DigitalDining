import BeatLoader from 'react-spinners/BeatLoader';
import Loading1 from "../Pictures/loading1.gif";
import Backimg from '../Pictures/login.jpg';
function FullPageLoader(props) {
    return (
        <div className='d-flex justify-content-center align-items-center ' style={{ width: "100%", height: "100vh",backgroundImage:{Backimg} }}>
            <div align="center  ">
                <img src={Loading1} className='col-3 ' /><br/>
                <div>Loading<BeatLoader size={10} color={'black'} /></div>
            </div>
        </div>
    )
}
export default FullPageLoader;