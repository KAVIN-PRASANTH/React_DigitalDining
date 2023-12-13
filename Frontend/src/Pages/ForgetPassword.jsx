import React, { useState } from "react";
import Email from "../Components/Email";
import "../CSS_Files/ForgetPassword.css";
import Otp from "../Components/Otp";
import ErrorBox from '../Components/ErrorBox';
import EmailValidation from '../Components/EmailValidation';
import EmailOtpValidation from "../Components/EmailOtpValidation";
import RandomNumberGenerator from "../Components/RandomNumberGenerator";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import LoadingButton from '../Components/LoadingButton';
import Swal from "sweetalert2"
const randomNumber = RandomNumberGenerator();
export var emailvariableToChangePassword = "";
function ForgetPassword() {
    const [userEmailErr, setuserEmailErr] = useState(false);
    const [otpMessageErr, setMessageErr] = useState(false);
    const [displayOtpContent, setdisplayOtpContent] = useState(false);
    const [sendOtpContent, setsendOtpContent] = useState(true);
    const [emailExistErr, setEmailExistErr] = useState(false)
    const [loadingOtpVerifyBtn,setLoadingOtpVerifyBtn]=useState(false);
    // const [otpTimer, setotpTimer] = useState("");
    const navigate = useNavigate();
    function validation(e) {
        let Email_tickimg = document.getElementById("Email_tickimg");
        let Email_wrongimg = document.getElementById("Email_wrongimg");
        e.preventDefault();
        let emailName = document.getElementById("loginEmail").value;
        emailvariableToChangePassword = emailName;
        setEmailExistErr(false);
        setMessageErr(false);
        setuserEmailErr(false);
        if (emailName !== '') {
            if (!EmailValidation(emailName)) {
                Email_tickimg.style.display = "none";
                Email_wrongimg.style.display = "block";
                setuserEmailErr(true);
            }
            else {
                Email_tickimg.style.display = "block";
                Email_wrongimg.style.display = "none";
                setuserEmailErr(false);
            }
        }
        else {
            Email_tickimg.style.display = "none";
            Email_wrongimg.style.display = "none";
            setuserEmailErr(false);
        }
    }
    async function OtpGenerator(e) {
        // Otptimer();
        setLoadingOtpVerifyBtn(true);
        e.preventDefault();
        let emailName = document.getElementById("loginEmail").value;
        if (emailName === '' || userEmailErr === true) {
            alert("Fields cannot be Empty");
            setLoadingOtpVerifyBtn(false);
            return;
        }
        else {

            let length = 0;
            await axios.post("api/isExistEmail", { emailName: emailName }).then((message) => {
                length = message.data.length;
            })
            if (length > 0) {
                setdisplayOtpContent(true);
                setsendOtpContent(false);
                let loginEmail = document.getElementById("loginEmail");
                loginEmail.setAttribute("disabled", "disabled");
                loginEmail.style.cursor = "not-allowed";
                await axios.post('api/sendEmail', { emailName: emailName, randomNumber: randomNumber }).then(res => {
                    Swal.fire({
                        icon: "success",
                        text: "OTP Send successfully"
                    }).then((message) => {
                        if (message.isConfirmed) {
                            setLoadingOtpVerifyBtn(false);
                        }
                    })
                    document.getElementById("forgetpass-verify-otp").style.display="block";
                }).catch(res => {
                    alert("not send");
                    setLoadingOtpVerifyBtn(false);
                })
            }
            else {
                setEmailExistErr(true);
                setLoadingOtpVerifyBtn(false);
            }

        }
    }
    function VerifyOtp(e) {
        setLoadingOtpVerifyBtn(true);
        e.preventDefault();
        let num1 = document.getElementById("Email1").value;
        let num2 = document.getElementById("Email2").value;
        let num3 = document.getElementById("Email3").value;
        let num4 = document.getElementById("Email4").value;
        let num5 = document.getElementById("Email5").value;

        let inputRandomNumber = num1 + num2 + num3 + num4 + num5;
        if (EmailOtpValidation(inputRandomNumber, randomNumber)) {
            setLoadingOtpVerifyBtn(false);
            Swal.fire({
                icon: "success",
                text: "OTP verified successfully"
            }).then((message) => {
                if (message.isConfirmed) {
                    navigate("/ChangePassword");
                }
            })

            setMessageErr(false);
        }
        else {
            setLoadingOtpVerifyBtn(false);
            setMessageErr(true);
        }
    }
    return (
        <div className="login_container_box font-style">
            <div style={{ backdropFilter: "blur(5px)" }} className='col-9 col-md-6 py-3' align="center" >
                <div className='login_inner_box   col-md-11 col-12'>
                            <div >
                                <h4>Forgot Password?</h4><br />
                            </div>
                            <form onChange={(e) => validation(e)}>
                                <Email placeHolderName="Email" userName="reply_to" setId="loginEmail" />
                                {userEmailErr && <div><ErrorBox message="Enter valid email" /></div>}
                                {emailExistErr && <div><ErrorBox message="Entered Email Not Exist" /></div>}
                            </form>
                            <br/>
                    {displayOtpContent &&
                        <div>
                            <span className="otp_text_style">ENTER THE OTP</span>
                            <Otp prefixName="Email" setId1="Email1" setId2="Email2" setId3="Email3" setId4="Email4" setId5="Email5" />
                            {otpMessageErr && <div className="py-1 col-10"><ErrorBox message="OTP did not match" /></div>}
                        </div>
                    }
                   {sendOtpContent && <div align="center" onClick={(e) => OtpGenerator(e)} >
                            {loadingOtpVerifyBtn ? <LoadingButton css="btn btn-success col-10 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Get OTP</button>
                            }
                    </div>}
                    <div align="center" style={{display:"none"}} onClick={(e) => VerifyOtp(e)} id="forgetpass-verify-otp">
                            {loadingOtpVerifyBtn ? <LoadingButton css="btn btn-success col-12 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Verify</button>}
                    </div>
                </div>
            </div>
        </div>


    );
}
export default ForgetPassword;