import React, { useEffect, useState } from "react";
import "../CSS_Files/FoodPage.css";
import FoodContainer from "../Components/FoodContainer";
import Dashboard from "../Components/Dashboard";
import TrollyPopupWindow from "../Components/TrollyPopupWindow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FullPageLoader from "../Components/FullPageLoader";
export const itemPrice = new Map();

function FoodPage() {
 
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [food, setFood] = useState([]);
  const [juice, setJuice] = useState([]);
  const [beverage, setBeverage] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [displayFood, setDisplayFood] = useState(true);
  const [displayJuice, setDisplayJuice] = useState(false);
  const [displayBeverages, setDisplayBeverages] = useState(false);
  const [displaySnacks, setDisplaySnacks] = useState(false);
  async function ButtonFood() {
    setDisplayFood(true);
    setDisplayJuice(false);
    setDisplayBeverages(false);
    setDisplaySnacks(false);
    await axios.post("/api/fetch_food_details", { Category: "Food" }).then((message) => {
      let data = message.data;
      setFood(DataStoring(data));
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
  async function ButtonJuice() {
    setDisplayFood(false);
    setDisplayJuice(true);
    setDisplayBeverages(false);
    setDisplaySnacks(false);
    await axios.post("/api/fetch_food_details", { Category: "Juice" }).then((message) => {
      let data = message.data;
      setJuice(DataStoring(data));
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
  async function ButtonBeverages() {
    setDisplayFood(false);
    setDisplayJuice(false);
    setDisplayBeverages(true);
    setDisplaySnacks(false);
    await axios.post("/api/fetch_food_details", { Category: "Beverages" }).then((message) => {
      let data = message.data;
      setBeverage(DataStoring(data));
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
  async function ButtonSnacks() {
    setDisplayFood(false);
    setDisplayJuice(false);
    setDisplayBeverages(false);
    setDisplaySnacks(true);
    await axios.post("/api/fetch_food_details", { Category: "Snacks" }).then((message) => {
      let data = message.data;
      setSnacks(DataStoring(data));
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
  function DataStoring(data) {
    let food_container_details = [];
    for (let count = 0; count < data.result.length; count++) {
      itemPrice.set(data.result[count].item_name, data.result[count].price);
      let DataList = {
        itemName: data.result[count].item_name,
        price: data.result[count].price,
        img: data.result[count].file_path,
        setId: data.result[count].item_name,
        fromTime: data.result[count].from_time,
        toTime: data.result[count].to_time,
        serverTime: data.serverTime,
        status: data.result[count].status
      }
      food_container_details.push(DataList);
    }
    return food_container_details;
  }
  async function authentication() {
    await axios.post("/foodPageAuthentication", { token: localStorage.getItem("token") }).then((message) => {
      let data = message.data;
      if (!data.auth) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You are not Authorized to access!',
          confirmButtonText: 'Ok',
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
        setLoader(false);
        if (data.pin === null) {
          Swal.fire({
            title: 'Create Payment PIN',
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
                            await axios.post("/api/update_payment_pin", { loginEmail: data.email, pin: pin })
                                .then((response) => {
                                    let data = response.data;
                                    if (data.auth && data.results.affectedRows === 1) {
                                        Swal.fire({ icon: "success", text: "PIN Updated Successfully" })
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

        }
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
  useEffect(() => {
    navigate('/FoodPage');
    authentication();
    ButtonFood();
  }, []);
  return (

    loader === false ?
      <div style={{ width: "100%", height: "108vh", backgroundColor: "antiquewhite", transition: ".9s" }} >
        <div className="food_page" id="home_page" style={{ position: "absolute", transition: ".5s" }}>
          <div className="container d-flex justify-content-center bg-primary">
            <div className="container d-flex justify-content-center" id="trolly_click_display_appera" style={{ position: "absolute", zIndex: "1", marginTop: "-1000px", marginLeft: "-8px", transition: ".5s" }}>
              <TrollyPopupWindow  />
            </div>
          </div>
          <br />
          <div >
            <div className="container">
              <div className="row d-flex justify-content-around">
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-sm-2 smooth" onClick={ButtonFood}>Food</button>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-sm-2 smooth" onClick={ButtonJuice}>Juice</button>
                <div className=" col-12 d-sm-none"><br /></div>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5  col-sm-2 smooth " onClick={ButtonBeverages}>Beverages</button>
                <button type="button" className="btn d-flex justify-content-center btn-primary col-5 col-sm-2 smooth" onClick={ButtonSnacks}>Snacks</button>
              </div>
            </div>
            <br />
            {displayFood && <div className="food_iteams_container container smooth" id="Food_container" >
              {food.map((number, index) => {
                return (<div>
                  <FoodContainer data={number} key={index} />
                  <br />
                </div>);
              })}
            </div>}
            {displayJuice && <div className="food_iteams_container container smooth" id="Juice_container" >
              {juice.map((number, index) => {
                return (<div>
                  <FoodContainer data={number} key={index} />
                  <br />
                </div>);
              })}
            </div>
            }
            {displayBeverages && <div className="food_iteams_container container smooth" id="Beverages_container">
              {beverage.map((number, index) => {
                return (<div>
                  <FoodContainer data={number} key={index} />
                  <br />
                </div>);
              })}
            </div>
            }
            {displaySnacks && <div className="food_iteams_container container smooth" id="Snacks_container">
              {snacks.map((number, index) => {
                return (<div>
                  <FoodContainer data={number} key={index} />
                  <br />
                </div>);
              })}
            </div>
            }
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="container">
            <Dashboard />
          </div>
        </div>
      </div>
      :
      <FullPageLoader backgroundColor="antiquewhite" color="black" />


  )

}
export default FoodPage;