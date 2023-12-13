import AdminHeader from "../Components/AdminHeader";
import BeatLoader from 'react-spinners/BeatLoader';
import Loading1 from "../Pictures/loading1.gif";

function AdminManageItem() {

    return (
        <div style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh" }}>
        <div style={{ position: "absolute", height: "auto", backgroundColor: "antiquewhite" }} className="col-12">
            <br />
            <AdminHeader />
            <div className="admin_container  col-12 ">
                
                <div className="col-12 container  d-flex justify-content-center align-items-center" style={{ height: "90vh" }} >
                    <div className="bg-white col-11 col-md-7 d-flex justify-content-center align-items-center" style={{ height: "300px", borderRadius: "15px" }}>
                        <div align="center ">
                            <img src={Loading1} width={100} height={100} /><br />
                            <div>Comming Soon<BeatLoader size={10} color={'black'} alt="Error in loading"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default AdminManageItem;