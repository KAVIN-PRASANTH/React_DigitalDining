import React, { useEffect, useState } from "react";
import "../CSS_Files/Profile.css";
import Avator from "../Pictures/profile.png"
import ReactDOMServer from 'react-dom/server';
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import axios from "axios";
import Swal from "sweetalert2";
function Profile() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/Profile');
        authentication();
    }, []);
    async function authentication() {
        await axios.post("https://digitaldining.onrender.com/foodPageAuthentication", { token: localStorage.getItem("token") }).then((message) => {
            let data = message.data;
            if (!data.auth) {
                Swal.fire({
                    icon: 'error', title: 'Oops...', text: 'You are not Authorized to access!', confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: "bg-danger"
                    }
                }).then((message) => {
                    if (message.isConfirmed) {
                        navigate("/")
                    }
                })
            }
            else {
                let sp=data.email.split("@");
                setEmail(sp[0]);
            }
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
    function logOut() {
        Swal.fire({
            title: 'Are you sure?', text: "You want to Log Out ?", icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Log Out!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                navigate("/");
            }
        })
    }
    function qrCodeDisplay() {
        const qrCodeHtml = ReactDOMServer.renderToString(<QRCode value={email} size={100} />)
        Swal.fire({
            title: 'Your Profile QR Code',
            html: qrCodeHtml,
        });
    }
    async function changePIN() {
        Swal.fire({
            title: 'Enter your Password',
            input: 'password',
            inputLabel: 'Password',
            inputPlaceholder: ' ******* ',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
                type: 'text',
            },
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Next',
            allowOutsideClick: false,
            willOpen: () => {
                Swal.showLoading();
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                const password = Swal.getInput().value;
                await axios.post("https://digitaldining.onrender.com/api/profile_password_authentication", { loginEmail: email, loginPassword: password })
                    .then((response) => {
                        if (response.data.auth) {
                            Swal.fire({
                                title: 'Enter your PIN',
                                input: 'password',
                                inputLabel: 'PIN 4-digit',
                                inputPlaceholder: 'Enter your PIN',
                                inputAttributes: {
                                    autocapitalize: 'off',
                                    autocorrect: 'off',
                                    type: 'text',
                                    pattern: '[0-9]*',
                                    maxlength: 4,
                                    minlength: 4,
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
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    const pin = result.value;
                                    Swal.fire({
                                        title: 'Conform your PIN',
                                        input: 'password',
                                        inputLabel: 'PIN 4-digit',
                                        inputPlaceholder: 'Enter your PIN',
                                        inputAttributes: {
                                            autocapitalize: 'off',
                                            autocorrect: 'off',
                                            type: 'text',
                                            pattern: '[0-9]*',
                                            maxlength: 4,
                                            minlength: 4,
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
                                    }).then(async (result) => {
                                        if (result.isConfirmed) {
                                            const confirmPin = result.value;
                                            if (pin === confirmPin) {
                                                await axios.post("https://digitaldining.onrender.comupdate_payment_pin", { loginEmail: email, pin: pin })
                                                    .then((response) => {
                                                        let data = response.data;
                                                        if (data.auth && data.results.affectedRows === 1) {
                                                            Swal.fire({ icon: "success", text: "PIN changed successfully" })
                                                        }
                                                        else {
                                                            Swal.fire({
                                                                icon: 'error', title: 'Oops...', text: 'Try again later!',
                                                                confirmButtonText: 'Ok',
                                                                customClass: {
                                                                    confirmButton: "bg-success"
                                                                }
                                                            })
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        Swal.fire({
                                                            icon: 'error', title: 'Oops...', text: 'Try again later!',
                                                            confirmButtonText: 'Ok',
                                                            customClass: {
                                                                confirmButton: "bg-success"
                                                            }
                                                        })
                                                    });
                                            } else {
                                                Swal.fire({
                                                    icon: 'error', title: 'PIN Mismatch',
                                                    text: 'The entered PINs do not match. Please try again.',
                                                });
                                            }
                                        }
                                    });
                                }
                            });

                        } else {
                            Swal.fire({
                                icon: 'error', title: 'Authentication Failed',
                                text: 'Please check your credentials and try again.',
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire({
                            icon: 'error', title: 'An Error Occurred',
                            text: 'There was an error during authentication. Please try again later.',
                        });
                    });
            }
        });
    }
    async function contactUs() {
        const { value: text } = await Swal.fire({
            title: "Contact Us",
            input: 'textarea',
            inputLabel: 'Enter your Queries ',
            inputPlaceholder: 'Type your message here...',
            inputAttributes: {
                'aria-label': 'Type your message here'
            },
            showCancelButton: true,
            confirmButtonText: "Send"
        })

        if (text) {
            Swal.fire(text)
        }
    }
    return (
        <div className="col-12 d-flex justify-content-center " style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh" }}>
            <div className="profile_container col-12 col-md-8 d-flex justify-content-center " style={{ marginTop: "15px", height: "580px"}}>
                <div align="center" className="col-md-9  col-12 p-3">
                    <div align="center" >
                        <div className="d-flex justify-content-center rounded-circle col-3 py-1"> <img src={Avator} width={100} height={100} alt="Error" /></div>
                    </div>
                    <div align="center" className="h6" style={{ fontFamily: "monospace" }}>Welcome Back</div>
                    <div align="center" className="h2 py-2" style={{ fontFamily: "monospace" }}>
                        {email}
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={() => navigate("/ForgetPassword")} >
                        <div className="col-9 h6"><i class="fa-sharp fa-solid fa-key"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Change Password</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={changePIN}>
                        <div className="col-9 h6"><i class="fa-regular fa-credit-card"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Change PIN</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={qrCodeDisplay}>
                        <div className="col-9 h6"><i class="fa-solid fa-qrcode"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Scan QR</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={() => navigate('/History')}>
                        <div className="col-9 h6"><i class="fa-solid fa-clock-rotate-left"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;History</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={contactUs}>
                        <div className="col-9 h6"><i class="fa-solid fa-headphones"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contact us</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="start" className="col-12 h5  py-2 px-3 rounded row profile_inner_box" onClick={()=>navigate("/FoodPage")}>
                        <div className="col-9 h6"><i class="fa-solid fa-house-chimney"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Go Back</div>
                        <div className="col-2"><i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                    <div align="center" className="col-12 h5 bg-warning py-2 px-3 rounded row profile_inner_box" onClick={logOut}>
                        <div className="col-12"> Log Out&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-right-from-bracket"></i></div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default Profile;