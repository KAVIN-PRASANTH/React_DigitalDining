import React, { useEffect, useState } from 'react';
import "../CSS_Files/Login.css";
import Email from '../Components/Email';
import Password from '../Components/Password';
import { Link, useNavigate } from 'react-router-dom';
import EmailValidation from '../Components/EmailValidation';
import PassValidation from '../Components/PassValidation';
import ErrorBox from '../Components/ErrorBox';
import axios from 'axios';
import LoadingButton from '../Components/LoadingButton';
import FullPageLoader from '../Components/FullPageLoader';
import Swal from 'sweetalert2';
function Login() {
    const [userEmailerr, setuserEmailerr] = useState(false);
    const [userPasserr, setPasserr] = useState(false);
    const [adminEmailerr, setadminEmailerr] = useState(false);
    const [adminPasserr, setadminPasserr] = useState(false);
    const [userEmailAccesserr,setUserEmailAccesserr]=useState(false);

    const [userEmailVerifyerr, setUserEmailVerifyerr] = useState(false);
    const [userPassVerifyerr, setUserPassVerifyerr] = useState(false);
    const [loadingLoginBtn, setLoadingLoginBtn] = useState(false);
    const [pageLoadingEffect, setPageLoadingEffect] = useState(true);
    const navigate = useNavigate();

    async function EmailAuthentication() {
        let data = localStorage.getItem("token");
        if (data !== null) {
            await axios.post("https://digitaldining.onrender.com/api/emailAuthentication", { token: data }).then((message) => {
                if (message.data.auth) {
                    navigate("/FoodPage");
                }
            }).catch((error) => {
                console.log("Error");
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
        setTimeout(()=>{
            setPageLoadingEffect(false);
        },1000);
        
    }
    useEffect(() => {
        EmailAuthentication();
    }, []);


    function validate(e) {
        e.preventDefault();
        //inputbox fields
        let typeName = document.getElementById("loginType").value;
        let emailName = document.getElementById("loginEmail").value;
        let passwordName = document.getElementById("loginPassword").value;
        //Tick and Cross icons variable
        let Email_tickimg = document.getElementById("Email_tickimg");
        let Email_wrongimg = document.getElementById("Email_wrongimg");
        let Pass_tickimg = document.getElementById("Pass_tickimg");
        let Pass_wrongimg = document.getElementById("Pass_wrongimg");

        setuserEmailerr(false);
        setPasserr(false);
        setUserEmailVerifyerr(false);
        setUserPassVerifyerr(false);
        setadminEmailerr(false);
        setadminPasserr(false);
        setUserEmailAccesserr(false);
        if (typeName === "Admin") {
            Email_tickimg.style.display = "none";
            Email_wrongimg.style.display = "none";
            Pass_tickimg.style.display = "none";
            Pass_wrongimg.style.display = "none";


            if (emailName !== '') {
                if (emailName === "kavinprasanth9626@gmail.com") {
                    Email_tickimg.style.display = "block";
                    Email_wrongimg.style.display = "none";

                    setadminEmailerr(false);
                }
                else {
                    Email_wrongimg.style.display = "block";
                    Email_tickimg.style.display = "none";
                    setadminEmailerr(true);

                }
            }
            else {
                Email_tickimg.style.display = "none";
                Email_wrongimg.style.display = "none";
                setadminEmailerr(false);
            }
            if (passwordName !== '') {
                if (passwordName === "karpagam") {
                    Pass_tickimg.style.display = "block";
                    Pass_wrongimg.style.display = "none";

                    setadminPasserr(false);
                }
                else {
                    Pass_wrongimg.style.display = "block";
                    Pass_tickimg.style.display = "none";
                    setadminPasserr(true);
                }
            }
            else {
                Pass_tickimg.style.display = "none";
                Pass_wrongimg.style.display = "none";
                setadminPasserr(false);
            }
        }
        else {
            Email_tickimg.style.display = "none";
            Email_wrongimg.style.display = "none";
            Pass_tickimg.style.display = "none";
            Pass_wrongimg.style.display = "none";

            if (emailName !== '') {
                if (!EmailValidation(emailName)) {
                    Email_wrongimg.style.display = "block";
                    Email_tickimg.style.display = "none";
                    setuserEmailerr(true);

                }
                else {
                    Email_tickimg.style.display = "block";
                    Email_wrongimg.style.display = "none";
                    setuserEmailerr(false);
                }
            }
            else {
                Email_tickimg.style.display = "none";
                Email_wrongimg.style.display = "none";
                setuserEmailerr(false);
            }
            if (passwordName !== '') {
                if (!PassValidation(passwordName)) {
                    Pass_wrongimg.style.display = "block";
                    Pass_tickimg.style.display = "none";
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
        }

    }
    async function RedirectNextpage(e) {
        e.preventDefault();

        let loginEmail = document.getElementById("loginEmail").value;
        let loginPassword = document.getElementById("loginPassword").value;
        let typeName = document.getElementById("loginType").value;
        if (typeName === "Student" && userEmailerr === false && userPasserr === false && loginEmail !== '' && loginPassword !== '') {
            setLoadingLoginBtn(true);

            //Tick and wrong icons
            let Email_tickimg = document.getElementById("Email_tickimg");
            let Email_wrongimg = document.getElementById("Email_wrongimg");
            let Pass_tickimg = document.getElementById("Pass_tickimg");
            let Pass_wrongimg = document.getElementById("Pass_wrongimg");
            loginEmail = loginEmail.trim().toLowerCase();

            await axios.post("https://digitaldining.onrender.com/api/fetch_login_details", { loginEmail, loginPassword }).then((message) => {
                const responseData = message.data;
                if(responseData.access===false)
                {
                    setUserEmailAccesserr(true);
                    setLoadingLoginBtn(false);
                    return ;
                }
                else if (responseData.emailAuth) {
                    if (responseData.passAuth) {
                        localStorage.setItem("token", responseData.token);
                        setLoadingLoginBtn(false);
                        navigate("/FoodPage");
                    }
                    else {
                        setUserPassVerifyerr(true);
                        setLoadingLoginBtn(false);
                        Pass_tickimg.style.display = "none";
                        Pass_wrongimg.style.display = "block";
                    }
                }
                else {
                    setUserEmailVerifyerr(true);
                    setLoadingLoginBtn(false);
                    Pass_tickimg.style.display = "none";
                    Pass_wrongimg.style.display = "block";
                    Email_tickimg.style.display = "none";
                    Email_wrongimg.style.display = "block";
                }
            }).catch((message) => {
                setLoadingLoginBtn(false);
                console.warn(message);
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
        else if (typeName === "Admin" && adminEmailerr === false && adminPasserr === false && loginEmail !== '' && loginPassword !== '') {
            navigate('/AdminModify');
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Invalid input fields"
            })
        }

    }
    return (
        pageLoadingEffect === true ? <FullPageLoader backgroundColor="black" color="white" /> :
            <div className='login_container_box'>
                <div style={{ backdropFilter: "blur(5px)" }} className='col-9 col-md-6' align="center" >
                    <div className='login_inner_box   col-md-11 col-12'>
                        <form onChange={(e) => validate(e)}>
                            <br />
                            <div className="font_style">
                                <h3>Login</h3>
                            </div>
                            <br />
                            <div className="row bg-white box_style "  >
                                <div className="col-1 d-flex justify-content-center align-items-center">
                                    <i class="fa-solid fa-user">&nbsp;&nbsp;|</i>
                                </div>
                                <div className="col-md-7 col-6 font_style" style={{ marginLeft: "-10px" }}>
                                    <select id="loginType">
                                        <option>Student</option>
                                        <option>Admin</option>
                                    </select>
                                </div>
                            </div>
                            <br />
                            <Email placeHolderName="Email" setId="loginEmail" />
                            {userEmailerr && <ErrorBox message="Enter valid email" />}
                            {userEmailAccesserr && <ErrorBox message="User Blocked" />}
                            {userEmailVerifyerr && <div><ErrorBox message="Email did not exist" /></div>}
                            {adminEmailerr && <div><ErrorBox message="Entered Admin is Not Valid" /></div>}
                            <br />
                            <Password placeHolderName="*******" setId="loginPassword" setIdTickImg="Pass_tickimg" setIdWrongImg="Pass_wrongimg" />
                            {userPasserr && <div><ErrorBox message="Password length must be greater than 6 characters" /></div>}
                            {userPassVerifyerr && <div><ErrorBox message="Password did not Match!" /></div>}
                            {adminPasserr && <div><ErrorBox message="Entered Admin Password is Not Valid" /></div>}
                        </form>

                        <div className="forget_box py-2" align="left">
                            <Link to="/ForgetPassword" className='font_style' style={{ color: "blue" }}>Forgot Password ?</Link>
                        </div>
                    </div>

                    <div align="center" onClick={(e) => RedirectNextpage(e)}>
                        {loadingLoginBtn ? <LoadingButton css="btn btn-success col-10 font_style" /> : <button className='btn btn-success col-10 font_style' style={{ fontSize: "larger", fontWeight: "500" }}>Login</button>
                        }
                    </div>
                    <div align="center">
                        <span className='small text-white' > Don't have an account?</span><span onClick={() => { navigate('/Register') }} className=' font_style register'>Register</span>
                        <br />   <br />
                    </div>
                </div>

            </div>
    );
}

export default Login;
