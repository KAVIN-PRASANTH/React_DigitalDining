import { useEffect, useState } from "react";
import axios from "axios";
import ModifyItem from "../Components/ModifyItem";
import AdminHeader from "../Components/AdminHeader";


function AdminModifyDetails() {
    
    const [modifyDetails, setModifyDetails] = useState([]);
    async function LoadDetails() {
        await axios.get("/api/fetch_modifyDetails").then((message) => {
            setModifyDetails(message.data);
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: "bg-danger"
                }
            })
        })
    }

    useEffect(() => {
        LoadDetails();
    }, []);
    return (
        <div style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh" }}>
            <div style={{ position: "absolute", width: "100%",height: "auto", backgroundColor: "antiquewhite" }}>
                <br />
               <div className="container">
               <AdminHeader />
               </div>
                <br />
                <div style={{ position: "absolute", height: "auto", backgroundColor: "antiquewhite" }} className="col-12">
                    {modifyDetails.map((details, index) => {
                        return (<div>
                            <ModifyItem data={details} />
                            <br />
                        </div>);
                    })}
                </div>
            </div>
        </div>
    );
}
export default AdminModifyDetails;