import React from "react";
import { useNavigate } from "react-router-dom";
function AdminHeader() {
    const navigate=useNavigate();
    return (
        <header className="container">
            <div className="row d-flex justify-content-between ">
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-md-2 " onClick={()=>navigate("/Admin")} >DashBoard</button>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-md-2 " onClick={()=>navigate("/AdminAddItem")}>Add</button>
                <div className="col-12 d-md-none"><br /></div>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 py-1 col-md-2 " onClick={()=>navigate("/AdminModify")}>Modify</button>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-md-2 " onClick={()=>navigate("/AdminManageItem")}>ManageItem</button>
            </div>
        </header>
    )
}
export default AdminHeader;