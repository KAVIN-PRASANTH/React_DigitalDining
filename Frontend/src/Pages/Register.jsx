import React, { useState } from "react";
import "../CSS_Files/Register.css"
import Email from "../Components/Email";
import Password from "../Components/Password";
import Popup from "../Components/Popup";
import PassValidation from '../Components/PassValidation';
import ErrorBox from '../Components/ErrorBox';
import EmailValidation from '../Components/EmailValidation';
import Otp from '../Components/Otp';
import RandomNumberGenerator from "../Components/RandomNumberGenerator";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import EmailOtpValidation from "../Components/EmailOtpValidation";
import LoadingButton from '../Components/LoadingButton';
import Swal from "sweetalert2";

const randomNumber = RandomNumberGenerator();
function Register() {
    const [userEmailerr, setuserEmailerr] = useState(false);
    const [userPasserr, setPasserr] = useState(false);
    const [userConformPasserr, setConformPasserr] = useState(false);
    const [otpMessageErr, setMessageErr] = useState(false);
    const [emailExistErr, setEmailExistErr] = useState(false);
    const [loadingSendOtpBtn, setLoadingSendOtpBtn] = useState(false);
    const [loadingOtpVerifyBtn, setLoadingOtpVerifyBtn] = useState(false);
    const [loadingRegisterBtn, setLoadingRegisterBtn] = useState(false);
    const navigate = useNavigate();

    function validation(e) {
        e.preventDefault();
        let emailName = document.getElementById("registerEmail").value;
        let passwordName = document.getElementById("registerPassword").value;
        let conformPasswordName = document.getElementById("registerConformPassword").value;

        let Email_tickimg = document.getElementById("Email_tickimg");
        let Email_wrongimg = document.getElementById("Email_wrongimg");
        let Pass_tickimg = document.getElementById("Pass_tickimg");
        let Pass_wrongimg = document.getElementById("Pass_wrongimg");
        let ConformPass_tickimg = document.getElementById("ConformPass_tickimg");
        let ConformPass_wrongimg = document.getElementById("ConformPass_wrongimg");

        // Mail-Validation
        if (emailName !== '') {
            if (!EmailValidation(emailName)) {
                Email_tickimg.style.display = "none";
                Email_wrongimg.style.display = "block";
                setuserEmailerr(true);

            }
            else {
                Email_tickimg.style.display = "block";
                Email_wrongimg.style.display = "none";
                setuserEmailerr(false);
                setEmailExistErr(false);
            }
        }
        else {
            Email_tickimg.style.display = "none";
            Email_wrongimg.style.display = "none";
            setuserEmailerr(false);
            setEmailExistErr(false);
        }

        //Password-Validation
        if (passwordName !== '') {
            if (!PassValidation(passwordName)) {
                Pass_tickimg.style.display = "none";
                Pass_wrongimg.style.display = "block";
                setPasserr(true);
            }
            else {
                Pass_tickimg.style.display = "block";
                Pass_wrongimg.style.display = "none";
                setPasserr(false);
            }
        }
        else {
            Pass_tickimg.style.display = "none";
            Pass_wrongimg.style.display = "none";
            setPasserr(false);
        }

        if (conformPasswordName !== '') {
            if (passwordName !== conformPasswordName) {
                ConformPass_tickimg.style.display = "none";
                ConformPass_wrongimg.style.display = "block";
                setConformPasserr(true);
            }
            else {
                ConformPass_tickimg.style.display = "block";
                ConformPass_wrongimg.style.display = "none";
                setConformPasserr(false);
            }
        }
        else {
            ConformPass_tickimg.style.display = "none";
            ConformPass_wrongimg.style.display = "none";
            setConformPasserr(false);
        }

    }
    async function OtpGenerator(e) {
        e.preventDefault();
        let Email_wrongimg = document.getElementById("Email_wrongimg");
        let Email_tickimg = document.getElementById("Email_tickimg");
        let emailName = document.getElementById("registerEmail").value;
        emailName = emailName.trim().toLowerCase();
        if (emailName === '' || userEmailerr === true) {
            Email_wrongimg.style.display = "block";
            Email_tickimg.style.display = "none";
            setuserEmailerr(true);
            return;
        }
        else {
            setLoadingSendOtpBtn(true);
            let length = 0;

            await axios.post("https://digitaldining.onrender.com/api/isExistEmail", { emailName }).then((message) => {
                length = message.data.length;
            }).catch((error) => {
                console.log(error, "Error");
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
            if (length === 0) {
                let popup_register_container = document.getElementById("popup_register_container");
                let popup_register_btn = document.getElementById("popup_register_btn");
                Email_tickimg.style.display = "block";
                Email_wrongimg.style.display = "none";
                setEmailExistErr(false);
                await axios.post('https://digitaldining.onrender.com/api/sendEmail', { emailName, randomNumber: randomNumber }).then(res => {
                  
                    setLoadingSendOtpBtn(false);
                    popup_register_container.style.marginTop = "0";
                    popup_register_btn.onclick = () => {
                        popup_register_container.style.marginTop = "-10000px";
                        let reg_otpbox_display = document.getElementById("reg-otpbox-display");
                        let reg_verify_otp = document.getElementById("reg-verify-otp");
                        let reg_send_otp = document.getElementById("reg-send-otp");
                        reg_otpbox_display.style.display = "block";
                        reg_send_otp.style.display = "none";
                        reg_verify_otp.style.display = "block";
                    }

                }).catch(res => {
                    alert("Error occured,Please try again later!");
                })
            }
            else {
                let Email_tickimg = document.getElementById("Email_tickimg");
                setEmailExistErr(true);
                setLoadingSendOtpBtn(false);
                Email_wrongimg.style.display = "block";
                Email_tickimg.style.display = "none";
            }
        }

    }
    function VerifyOtp(e) {
        e.preventDefault();
        setLoadingOtpVerifyBtn(true);
        let registerEmail = document.getElementById("registerEmail");
        let num1 = document.getElementById("Email1").value;
        let num2 = document.getElementById("Email2").value;
        let num3 = document.getElementById("Email3").value;
        let num4 = document.getElementById("Email4").value;
        let num5 = document.getElementById("Email5").value;
        let inputRandomNumber = num1 + num2 + num3 + num4 + num5;

        if (EmailOtpValidation(inputRandomNumber, randomNumber)) {
            let reg_otpbox_display = document.getElementById("reg-otpbox-display");
            let reg_verify_otp = document.getElementById("reg-verify-otp");
            let reg_password_container = document.getElementById("reg-password-container");
            reg_verify_otp.style.display = "none";
            reg_password_container.style.display = "block";
            reg_otpbox_display.style.display = "none";
            registerEmail.style.cursor = "not-allowed";
            registerEmail.setAttribute("readonly", true);
            setMessageErr(false);
            setLoadingOtpVerifyBtn(false);
        }
        else {
            setMessageErr(true);
            setLoadingOtpVerifyBtn(false);
        }
    }
    async function registerData(e) {
        let emailName = document.getElementById("registerEmail").value;
        emailName = emailName.trim().toLowerCase();
        let passwordName = document.getElementById("registerPassword").value;
        let conformPasswordName = document.getElementById("registerConformPassword").value;

        if (!userEmailerr && !userPasserr && !otpMessageErr && emailName !== '' && passwordName !== '' && conformPasswordName !== '') {
            setLoadingRegisterBtn(true);
            let passwordName = document.getElementById("registerPassword").value;
            e.preventDefault();
            await axios.post('https://digitaldining.onrender.com/api/registerData', { emailName: emailName, pass: passwordName }).then((message) => {
                if (message.data.affectedRows === 1) {
                    Swal.fire({
                        icon: 'success',
                        text: 'Registration successfull',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: "bg-success"
                        }
                    }).then((message) => {
                        if (message.isConfirmed) {
                            navigate('/');
                        }
                    })
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: "Oops...",
                        text: 'Try Again Later',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: "bg-danger"
                        }
                    }).then((message) => {
                        if (message.isConfirmed) {
                            navigate('/');
                        }
                    })
                }
                setLoadingRegisterBtn(false);


            }).catch((message) => {
                setLoadingRegisterBtn(false);
                alert("Not registered");
            })
        }
    }

    return (
        <div className="login_container_box">
            <div style={{ backdropFilter: "blur(5px)" }} className='col-9 col-md-6' align="center" >
                <div className="login_inner_box   col-md-11 col-12 py-2">
                    <form onChange={(e) => validation(e)}>
                        <div className="h3" style={{ color: "white" }}>Register</div>
                        <br />
                        <Email placeHolderName=" Email" setId="registerEmail" />
                        {userEmailerr && <div><ErrorBox message="Enter valid email" /></div>}
                        {emailExistErr && <div><ErrorBox message="Email Already Exist!" /></div>}
                        <div style={{ display: 'none' }} id="reg-otpbox-display"><br />
                            <h7 className="otp_text_style">Enter OTP sent to your E-mail</h7>
                            <Otp prefixName="Email" setId1="Email1" setId2="Email2" setId3="Email3" setId4="Email4" setId5="Email5" />
                            {otpMessageErr && <div className="py-1 col-10"><ErrorBox message="OTP did not match" /></div>}
                        </div>

                        <div style={{ display: 'none', transition: "1s" }} id="reg-password-container"><br />
                            <Password placeHolderName=" Password" setId="registerPassword" setIdTickImg="Pass_tickimg" setIdWrongImg="Pass_wrongimg" />
                            {userPasserr && <div><ErrorBox message="Password length must be greater than 6 characters" /></div>}<br/>
                            <Password placeHolderName=" Conform Password" setId="registerConformPassword" setIdTickImg="ConformPass_tickimg" setIdWrongImg="ConformPass_wrongimg" />
                            {userConformPasserr && <div><ErrorBox message="Password did not match" /></div>}
                            <div align="center" onClick={(e) => registerData(e)} className="pt-3">
                                {loadingRegisterBtn ? <LoadingButton css="btn btn-success col-12 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Register</button>}
                            </div>
                        </div>
                        <br />
                        <div align="center" onClick={(e) => OtpGenerator(e)} id="reg-send-otp">
                            {loadingSendOtpBtn ? <LoadingButton css="btn btn-success col-12 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Get OTP</button>
                            }
                        </div>
                        <div align="center" style={{ display: "none" }} onClick={(e) => VerifyOtp(e)} id="reg-verify-otp">
                            {loadingOtpVerifyBtn ? <LoadingButton css="btn btn-success col-12 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Verify</button>}
                        </div>
                        <br />
                    </form>
                </div>
            </div>
            <div align="center" id="popup_register_container" style={{ position: "absolute", width: "100%", transition: ".8s", marginTop: "-10000px", zIndex: "1" }}>
                <Popup message="OTP Sent Successfully" setId="popup_register_btn" setTextBoxId="register_text_box" />
            </div>
        </div>
    );
}
export default Register;