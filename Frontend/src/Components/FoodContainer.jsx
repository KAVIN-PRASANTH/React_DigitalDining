import React, { useState, useEffect } from "react";
import CountUpdate from "../Components/CountUpdate";
import { ref,getDownloadURL } from "firebase/storage";
import { imageDb } from "../Components/Firebase";

function FoodContainer(props) {
 const [count,setCount]=useState(0);
 const [imgPath,setImgPath]=useState("");
  let food_container_block = {
    backgroundColor: "white",
    height: "auto",
    padding: "25px 10px",
    borderRadius: "10px",
  };
  const fc_img_block =
  {
    borderRadius: "10px",
  };
  const count_box_style =
  {
    color: "red",
    padding: "10px 30px",
    borderRadius: "10px",
    backgroundColor: "gold",
  };
  async function SetImageURL(){
    const imgRef = ref(imageDb, `${props.data.img}`);
     const imageUrl = await getDownloadURL(imgRef);
     setImgPath(imageUrl);
  }
  function CartCount(symbol) {
    let total_iteam_count = document.getElementById("total_iteam_count");
    let innerValue=(total_iteam_count.innerText).trim();
    let number=Number(innerValue);
    if (number !== 0 && symbol === "-") {
      number = number - 1;
    } else if (symbol === "+") {
      number = number + 1;
    }
    total_iteam_count.innerText = number;
  }
  function Decrement() {
    if (count !== 0) {
      setCount(count-1);
      CartCount("-");
    }
  }
  function Increment() {
    setCount(count+1);
    CartCount("+");
  }
  useEffect(()=>{
    CountUpdate(count, props.data.setId);
  },[count]);
  useEffect(()=>{
    SetImageURL();
  },[]);
  return (
    <div className="container" >
      <div className="row d-flex justify-content-sm-between align-items-center" style={food_container_block} id={`${props.data.itemName}_container`}>
        <div className="col-md-3">
          <img className="img-fluid " style={fc_img_block} src={imgPath} alt="Faild to Load Image" />
        </div>
        <div className="col-md-9" style={{ padding: "20px 10px" }}>
          <div className="d-flex justify-content-evenly align-items-center">
            <div className="col-6">
              <div className="d-flex justify-content-evenly align-items-center flex-column">
                <p className="h5" style={{ wordBreak: 'break-all' }}>{props.data.itemName}</p>
                <span className="h3" style={{ color: "red" }}>₹{props.data.price}</span>
              </div>
            </div>
            <div className="col-6">
               <div className="d-flex justify-content-around align-items-center">
                <button type="button" className="col-2 btn btn-primary  d-flex justify-content-center align-items-center" id={`decrement_button${props.data.itemName}`} onClick={(e) => Decrement()}>-</button>
                <span className="col-3 h4   d-flex justify-content-center align-items-center" id={props.data.setId} style={count_box_style}>{count}</span>
                <button type="button" className="col-2 btn btn-primary  d-flex justify-content-center align-items-center " id={`increment_button${props.data.itemName}`} onClick={(e) => Increment()} > +</button>
              </div> 
            </div>
          </div>
        </div>
        <div className="container  d-flex justify-content-center" >
          <div className="time_block col-sm-6 text-center" >
            Available Time <span style={{ color: "blue" }}>{props.data.fromTime.substring(0, 5)}-{props.data.toTime.substring(0, 5)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FoodContainer;
