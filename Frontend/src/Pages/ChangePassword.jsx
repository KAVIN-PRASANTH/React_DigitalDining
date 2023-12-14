import React, { useState } from "react";
import Password from "../Components/Password";
import gmailgif from '../Pictures/gmail1.gif';
import PassValidation from "../Components/PassValidation";
import ErrorBox from "../Components/ErrorBox";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { emailvariableToChangePassword } from "./ForgetPassword";
import "../CSS_Files/ChangePassword.css"
import LoadingButton from "../Components/LoadingButton";
function ChangePass() {
    const [userPasserr, setPasserr] = useState(false);
    const [userConformPasserr, setConformPasserr] = useState(false);
    const [loadingLoginBtn, setLoadingLoginBtn] = useState(false);
    const navigate = useNavigate();
    function Validation(e) {
        e.preventDefault();
        let passwordName = document.getElementById("registerPassword").value;
        let conformPasswordName = document.getElementById("registerConformPassword").value;
        let Pass_tickimg = document.getElementById("Pass_tickimg");
        let Pass_wrongimg = document.getElementById("Pass_wrongimg");
        let ConformPass_tickimg = document.getElementById("ConformPass_tickimg");
        let ConformPass_wrongimg = document.getElementById("ConformPass_wrongimg");

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
    async function ChangePassword(e) {
        let passwordName = document.getElementById("registerPassword").value;
        e.preventDefault();
        await axios.post('https://digitaldining.onrender.com/api/update', { passwordName: passwordName, emailName: emailvariableToChangePassword }).then((message) => {
            Swal.fire({
                icon: "success",
                text: "Password Changed successfully"
            }).then((message) => {
                if (message.isConfirmed) {
                    navigate("/");
                }
            })
        }).catch((message) => {
            alert("Error Occured in Client Side")
        })

    }
    return (
        <div className='login_container_box py-2'>
            <div style={{ backdropFilter: "blur(5px)" }} className='col-9 col-md-6' align="center" >
                <div className='login_inner_box   col-md-11 col-12'>
                    <div className="align_center">
                        <div>
                            <img src={gmailgif} alt="" className="gmailgifimg" />
                        </div>
                    </div>
                    <br />
                    <form onChange={(e) => { Validation(e) }}>
                        <Password placeHolderName="New Password" setId="registerPassword" setIdTickImg="Pass_tickimg" setIdWrongImg="Pass_wrongimg" />
                        {userPasserr && <div><ErrorBox message="Password length must be greater than 6 characters" /></div>}
                        <br />
                        <Password placeHolderName="Conform Password" setId="registerConformPassword" setIdTickImg="ConformPass_tickimg" setIdWrongImg="ConformPass_wrongimg" />
                        {userConformPasserr && <div><ErrorBox message="Password did not match" /></div>}
                        <br />
                        <div align="center" onClick={(e) => ChangePassword(e)}>
                            {loadingLoginBtn ? <LoadingButton css="btn btn-success col-10 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500", color: "black" }}>Change Password</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ChangePass;