import React, { useState } from "react";
import axios from "axios";
import ErrorBox from "../Components/ErrorBox";
import PropagateLoader from 'react-spinners/PulseLoader';
import AdminHeader from "../Components/AdminHeader";
import Swal from "sweetalert2";
import { imageDb } from "../Components/Firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";


function AdminAddItem() {
    const [imgFormatError, setImgFormatError] = useState(false);
    const [file, setFile] = useState(null);
    const [itemName, setItemName] = useState("");
    let [extension, setExtension] = useState("");
    const [itemNameAvailableError, setItemNameAvailableError] = useState(false);
    const [itemNameNullError, setitemNameNullError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();

    function ValidateFile(e) {
        e.preventDefault();
        setImgError(false);
        let imgName = e.target.value;
        let entension = imgName.split(".");
        if ((entension[entension.length - 1]).toLowerCase() === "png" || entension[entension.length - 1].toLowerCase() === "jpg" || entension[entension.length - 1].toLowerCase() === "jpeg") {
            setExtension(entension[entension.length - 1]);
            setImgFormatError(false);
            setFile(e.target.files[0]);
        }
        else {
            setImgFormatError(true);
        }
    }
    async function Validate(e) {
        e.preventDefault();
        let foodImage = document.getElementById("foodImage").value;
        let addItemItemName = document.getElementById("addItemItemName").value;
        let addItemPrice = document.getElementById("addItemPrice").value;
        let addItemFoodType = document.getElementById("addItemFoodType").value;
        let fromTime = document.getElementById("fromTime").value;
        let toTime = document.getElementById("toTime").value;
        if (foodImage === "" || file === null)
            setImgError(true);
        if (addItemItemName === "")
            setitemNameNullError(true);
        if (addItemPrice === "" || addItemPrice <= 0)
            setPriceError(true);
        if (fromTime === "" || toTime === "")
            setDateError(true);

        if (imgFormatError === false && itemNameAvailableError === false && itemNameNullError === false && priceError === false && dateError === false && imgError === false &&
            foodImage !== "" && addItemItemName !== "" && addItemPrice !== "" && addItemPrice > 0 && fromTime !== "" && toTime !== "") {
            setLoader(true);

            await axios.post("https://digitaldining.onrender.com/api/foodContainer_ItemName", { itemName: itemName }).then(async (message) => {
                console.log(message);
                let data = message.data;
                if (data.id === null)
                    data.id = 1;
                else
                    data.id = Number(data.id) + 1;
                if (data.length >= 1) {
                    setItemNameAvailableError(true);
                    setLoader(false);
                }
                else {
                    const imgRef = ref(imageDb, `files/${data.id}.${extension}`)
                    uploadBytes(imgRef, file);
                    await axios.post('https://digitaldining.onrender.com/api/upload_foodcontainer', { addItemItemName: addItemItemName.trim(), addItemPrice, addItemFoodType, fromTime, toTime, file_path: `files/${data.id}.${extension}` })
                        .then((message) => {
                            if (message.data.affectedRows) {
                                Swal.fire({
                                    icon: "success",
                                    text: "Item added successfully"
                                }).then((message) => {
                                    if (message.isConfirmed) {
                                        let myform = document.getElementById("myform");
                                        myform.reset();
                                        navigate('/AdminAddItem')
                                    }
                                })
                            }
                            setLoader(false);
                        })
                        .catch((error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Try again later',
                                confirmButtonText: 'Ok',
                                customClass: {
                                    confirmButton: "bg-danger"
                                }
                            })
                            console.error('Error uploading image:', error);
                            setLoader(false);
                        });

                }
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Try again later',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: "bg-danger"
                    }
                })
                console.error('Fetching itemName error:', error);
                setLoader(false);
            });
        }


    }
    return (
        <div style={{ backgroundColor: "antiquewhite", width: "100%", height: "100vh" }}>
            <div style={{ position: "absolute", height: "auto", backgroundColor: "antiquewhite" }} className="col-12">
                <br />
                <AdminHeader />
                <br />
                <form className="container add_item_container" id="myform">
                    <div className="row d-flex justify-content-around">
                        <div className="col-sm-5">
                            <label className="additem_title_text">FoodName:</label>
                            <input className="add_input_box" type="text" id="addItemItemName" autoFocus="on" onChange={(e) => { setItemName(e.target.value); setItemNameAvailableError(false); setitemNameNullError(false) }} />
                            <div className="col-12">{itemNameAvailableError && <ErrorBox message="Entered name is already Exist!" />}</div>
                            <div className="col-12">{itemNameNullError && <ErrorBox message="Field cannot be empty!" />}</div>
                        </div>
                        <div className="col-sm-5">
                            <label className="additem_title_text">FoodPrice:</label>
                            <input className=" add_input_box" type="number" id="addItemPrice" onChange={() => { setPriceError(false) }} />
                            <div className="col-12">{priceError && <ErrorBox message="Enter Valid Input" />}</div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-around">
                        <div className="col-sm-5">
                            <label className="additem_title_text"> Category:</label>
                            <select className="col-12" id="addItemFoodType" style={{ backgroundColor: "ButtonFace", color: "black", padding: "5px", marginLeft: "-0px" }}>
                                <option>Food</option>
                                <option>Juice</option>
                                <option>Beverages</option>
                                <option>Snacks</option>
                            </select>

                        </div>
                        <div className="col-sm-5">
                            <div className="row" style={{ width: "100%" }} >
                                <div className="col-6  ">
                                    <label className="additem_title_text">From&nbsp;</label>
                                    <input type="time" id="fromTime" style={{ width: "100%" }} onChange={() => { setDateError(false) }} />&nbsp;
                                </div>
                                <div className="col-6  ">
                                    <label className="additem_title_text">To&nbsp;</label>
                                    <input type="time" id="toTime" style={{ width: "100%" }} onChange={() => { setDateError(false) }} />
                                </div>
                            </div>
                            <div className="col-12">{dateError && <ErrorBox message="Field cannot be empty!" />}</div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-around">
                        <div className="col-sm-5">
                            <input type="file" accept=".jpg, .jpeg, .png" id="foodImage" onChange={(e) => ValidateFile(e)} />
                            <div className="col-12">{imgFormatError && <ErrorBox message="only .jpg, .jpeg, .png are allowed" />}</div>
                            <div className="col-12">{imgError && <ErrorBox message="Field cannot be empty!" />}</div>
                        </div>
                        <div className="col-sm-5"></div>
                    </div>
                    <div align="center" >
                        <br />
                        <button className="col-6 btn btn-primary" onClick={(e) => Validate(e)}>{loader ? <PropagateLoader size={10} color="black" /> : "ADD"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AdminAddItem;