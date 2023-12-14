
import axios from "axios";
import { iteamNameBackend } from "./Cart";
import { priceBackend } from "./Cart";
import { quantityBackend } from "./Cart";
import { totalAmountBackend } from "./Cart";
import { netAmountBackend } from "./Cart";
import { useNavigate } from "react-router-dom";

function TrollyPopupWindow() {
    const navigate = useNavigate();
    function DisplayPopup() {
        document.getElementById("trolly_click_display_appera").style.marginTop = "-1000px";
    }
    function Payment() {

        var option = {
            key: "rzp_test_s0UEZxzyjkpkOv",
            key_secret: "8PfaiwRWCeqCtkKZwE8KylUE",
            amount: netAmountBackend * 100,
            currency: "INR",
            name: "KCE Food Court",
            description: "Testing purpose",
            handler: async function (response) {

                if (response.razorpay_payment_id) {
                    let maxToken = 0;
                    let email = "";
                    await axios.post("http://localhost:8000/api/fetchMaxToken", { id: localStorage.getItem("token") }).then((message) => {
                        if (message.data.token.length === 0)
                            maxToken = 1;
                        else
                            maxToken = Number(message.data.token[0].max) + 1;
                        email = message.data.email;
                    }).catch((message) => {
                        console.log(message);
                    })
                    await axios.post("http://localhost:8000/api/paymentDetails", { id: localStorage.getItem("token"), token: maxToken, payment_id: response.razorpay_payment_id, netAmountBackend: netAmountBackend, payment_status: "success" }).then((message) => {
                    }).catch((message) => {
                        console.log(message);
                    })
                    let orderListValues = "";
                    email = "'" + email + "'";
                    for (let count = 0; count < iteamNameBackend.length; count++) {
                        orderListValues += "(";
                        orderListValues += `${email},${maxToken},'${iteamNameBackend[count]}',${quantityBackend[count]},${priceBackend[count]},${totalAmountBackend[count]}),`;
                    }
                    orderListValues = orderListValues.substring(0, orderListValues.length - 1) + ";";
                    await axios.post("http://localhost:8000/api/orderedItemDetails", { orderListValues }).then((message) => {
                        document.getElementById("total_iteam_count").innerText = "0";
                        navigate("/History")
                    }).catch((message) => {
                        console.log(message);
                    })
                }
                else {
                    console.log(response.console.error);
                }
            },
            prefill: {
                name: "kavin",
                email: "prasanthkavin4@gmail.com",
                contact: "9626170175"
            },
            notes: {
                address: "razarpay corporate office"
            },
            theme: {
                color: "blue"
            }

        };
        var pay = new window.Razorpay(option);
        pay.open();


    }
    return (
        <div className="container trolly_popup_window col-11 d-flex justify-content-center  flex-column">
            <div className="row" id="trolly_text_box"></div>
            <div className="row d-flex justify-content-center justify-content-around">
                <button className="btn btn-primary col-3 d-flex justify-content-center align-items-center " onClick={DisplayPopup}>Cancel</button>
                <button className="btn btn-primary col-3 d-flex justify-content-center align-items-center " onClick={Payment}>Pay</button>
            </div>
        </div>
    )
}
export default TrollyPopupWindow;