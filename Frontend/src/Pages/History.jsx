import React, { useEffect, useState } from "react";
import "../CSS_Files/History.css";
import axios from "axios";
import HistoryTable from "../Components/HistoryTable";
import Swal from "sweetalert2";


function History() {
    const [details, setDetails] = useState([]);
    

    async function getMaxToken() {
        let id = localStorage.getItem("token");
        await axios.post("https://digitaldining.onrender.com/api/fetchMaxToken", { id }).then((message) => {
            let maxToken = 0;
            if (message.data.token.length === 0) {
                Swal.fire({
                    title: 'No items purchased',
                    icon: 'info',
                    confirmButtonText: 'OK',
                  });
            }
            else {
                maxToken = Number(message.data.token[0].max);
                fetch(maxToken);
            }
        }).catch((message) => {
            console.warn(message)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: "bg-danger"
                }
            })
        });
    }
    async function fetch(maxToken) {
        let id = localStorage.getItem("token");
        await axios.post("https://digitaldining.onrender.com/api/fetchHistoryDetails", { id }).then((message) => {
            let { itemDetails, paymentDetails } = message.data;
            if (paymentDetails.length !== 0) {
                let detailArray = []
                let temp = [];
                let flag = 0;
                for (let count = 0; count < itemDetails.length; count++) {
                    if (itemDetails[count].token === maxToken) {
                        temp.push(itemDetails[count]);
                    }
                    else {
                        temp.push(paymentDetails[flag++]);
                        detailArray.push(temp);
                        temp = [];
                        maxToken--;
                        temp.push(itemDetails[count]);
                    }
                }
                temp.push(paymentDetails[flag]);
                detailArray.push(temp);
                setDetails(detailArray);
            }
            else {
                alert("nothing to show");
            }
        }).catch((message) => {
            console.warn(message)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: "bg-danger"
                }
            })
        });
    }
    useEffect(() => {
        getMaxToken();
    }, []);
    return (
        <div className="history_container" style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh", overflow: "scroll" }}  >
            <div className="container">
                <div className="h2  history_head "><center>History&nbsp;&nbsp;<i style={{ marginTop: "5px" }} class="fa-solid fa-clock-rotate-left"></i></center></div>
            </div>
            <div style={{ backgroundColor: "antiquewhite", width: "100%", height: "auto" }} >
                {details.map((details, index) => {
                    return (<div key={index}>
                        <HistoryTable data={details} />
                    </div>)
                })}
            </div>
            
        </div>
    )
}
export default History;