import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import QRCode from "react-qr-code";
import ReactDOMServer from 'react-dom/server';

function HistoryTable(props) {
    const [details, setDetails] = useState(props.data);
    function openQRCode() {
        Swal.fire({
            title: 'Enter your PIN 4-digit',
            input: 'password',
            inputPlaceholder: 'Enter your PIN',
            inputAttributes: {
                maxlength: 4,
                minlength: 4,
                autocapitalize: 'off',
                autocorrect: 'off',
                type: 'text',
                pattern: '[0-9]*',
            },
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Next',
            allowOutsideClick: false,
            inputValidator: (value) => {
                if (!value.match(/^[0-9]*$/)) {
                    return 'Please enter a valid 4-digit PIN';
                }
                if (value.length !== 4) {
                    return 'Please enter a 4-digit PIN';
                }
            },
            willOpen: () => {
                Swal.showLoading();
            },
        }).then(async(result) => {
           if(result.isConfirmed)
           {
            let pin=result.value;
            await axios.post("/api/verify_payment_pin",{pin,email:details[0].email}).then((message)=>{
                let data=message;
                if(data.data.auth)
                {
                    const qrCodeHtml = ReactDOMServer.renderToString( <div><p>Scan QR to make payment</p><QRCode value={details[details.length-1].payment_id} size={100} /></div>)
                    Swal.fire({
                        title: 'QR Code',
                        html: qrCodeHtml,
                    });
                }
                else{
                    Swal.fire({
                        icon: 'error', title: 'PIN Mismatch',
                        text: 'The entered PIN do not match. Please try again.',
                    });
                }
            }).catch((error)=>{
                Swal.fire({
                    icon: 'error', title: 'Oops...', text: 'Try again later!',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: "bg-success"
                    }
                })
            })
           }
        });

    }

    return (
        <div className="container" >
            <table className="table " style={{ backgroundColor: "white" }}>
                <thead style={{ backgroundColor: "orange" }} >
                    <tr className="col-12">
                        <th scope="row" className="col-3">Name</th>
                        <th className="col-2">Quantity</th>
                        <th className="col-2">Price</th>
                        <th className="col-3">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((data, index) => {
                        if (index !== props.data.length - 1)
                            return (
                                <tr key={index} className="col-12">
                                    <th className="col-4" style={{ fontWeight: "normal" }}>{`${data.item_Name}`}</th>
                                    <td className="col-2">{`${data.quantity}`}</td>
                                    <td className="col-2">{`${data.price}`}</td>
                                    <td className="col-3">{`${data.total_price}`}</td>
                                </tr>
                            )
                        else {
                            return (
                                <tr style={{ fontWeight: "bolder", backgroundColor: "white" }}>
                                    <td colSpan={1} className="text-center"><button style={{ cursor: "pointer" }} className="btn btn-success col-sm-10 col-12 rounded" onClick={openQRCode}>Scan QR</button></td>
                                    <td colSpan={2} className="text-right" >Net Amount:</td>
                                    <td>{data.net_amount}</td>
                                </tr>
                            )
                        }
                    })}

                </tbody>
            </table>
        </div>
    )
}
export default HistoryTable;