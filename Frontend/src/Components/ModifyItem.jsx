import Edit from "../Pictures/edit.png";
import Delete from "../Pictures/delete.png";
import axios from "axios";
import ErrorBox from "./ErrorBox";
import { useState } from "react";
import LoadingButton from '../Components/LoadingButton';
import Swal from "sweetalert2";
import { imageDb } from "../Components/Firebase";
import {ref,uploadBytes} from "firebase/storage";
import { useNavigate } from "react-router-dom";
function ModifyItem(props) {
  
  let data = props.data;
  const navigate=useNavigate();
  const [fromTime, setFromTime] = useState(data.from_time);
  const [toTime, setToTime] = useState(data.to_time);
  const [itemName, setItemName] = useState(data.item_name);
  const [price, setPrice] = useState(data.price);
  const [category, setCategory] = useState(data.category);
  const [imgFormatError, setImgFormatError] = useState(false);
  const [extension, setExtension] = useState("");
  const [file, setFile] = useState(null);
  const [loader, setLoader] = useState(false);

  const nameId = `item_name${data.id}`;
  const priceId = `item_price${data.id}`;
  const itemFromTimeId = `item_from_time${data.id}`;
  const itemToTimeId = `item_to_time${data.id}`;
  const itemCategoryId = `item_category${data.id}`;
  const itemImgId = `item_img${data.id}`;
  const editTextId = `edit_text${data.id}`

  function ValidateFile(e) {
    setImgFormatError(false);
    let imgName = e.target.value;
    let entension = imgName.split(".");
    if ((entension[entension.length - 1]).toLowerCase() === "png" || entension[entension.length - 1].toLowerCase() === "jpg" || entension[entension.length - 1].toLowerCase() === "jpeg") {
      setImgFormatError(false);
      setExtension(entension[entension.length - 1]);
      setFile(e.target.files[0]);
    }
    else {
      setImgFormatError(true);
    }
  }
  function DeleteItem() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: "No, cancel!",
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: '#E74C3C', 
    cancelButton: 'bg-danger',   
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        let item_name = document.getElementById(`${nameId}`).value;
        await axios.delete(`https://digitaldining.onrender.com/api/delete_foodItem${item_name}`).then((message) => {
          if (message.data.affectedRows === 1) {
            Swal.fire(
              'Deleted!',
              'Item has been deleted Successfully',
              'success'
            ).then((message) => {
              if (message.isConfirmed) {
                navigate("/AdminModify");
              }
            })
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Try again later!',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: "bg-success"
              }
            }).then((message) => {
              if (message.isConfirmed) {
                navigate("/AdminModify")
              }
            })
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
      else if (result.isDismissed) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: "#655cc9"
          }
        })
      }
    })
  }
  function EnableEdit() {
    let item_name = document.getElementById(`${nameId}`);
    let item_price = document.getElementById(`${priceId}`);
    let item_from_time = document.getElementById(`${itemFromTimeId}`);
    let item_to_time = document.getElementById(`${itemToTimeId}`);
    let item_img = document.getElementById(`${itemImgId}`);
    let edit_text = document.getElementById(`${editTextId}`);
    let item_category = document.getElementById(`${itemCategoryId}`);

    if (edit_text.innerText === "Edit") {
      edit_text.innerText = "Apply";
      item_name.removeAttribute("disabled");
      item_name.focus();
      item_price.removeAttribute("disabled");
      item_from_time.removeAttribute("disabled");
      item_to_time.removeAttribute("disabled");
      item_img.removeAttribute("disabled");
      item_category.removeAttribute("disabled");
    }
    else {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        customClass: {
          confirmButton: ' #4CAF50',
          denyButton: '#E74C3C',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (file === null) {
            setLoader(true);
           await axios.patch("https://digitaldining.onrender.com/api/modify_food_details_WithoutImg", { oldName: data.item_name, itemName: item_name.value.trim(), fromTime, toTime, price, category}).then((message) => {
            if (message.data.affectedRows === 1) {
              Swal.fire({
                icon: "success",
                title: "Changes Saved",
                confirmButtonText: "Ok"
              }).then((message) => {
                if (message.isConfirmed) {
                  navigate("/AdminModify")
                }
              })
            }
            else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Try again later!',
                confirmButtonText: 'Ok',
                customClass: {
                  confirmButton: "bg-success"
                }
              }).then((message) => {
                if (message.isConfirmed) {
                  navigate("/AdminModify")
                }
              })
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
          setLoader(false);
        }
        else {
          const imgRef = ref(imageDb, `files/${data.id}.${extension}`)
          try {
            await  uploadBytes(imgRef, file); 
          } catch (err) {
            console.log("Error", err);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Try again later',
              confirmButtonText: 'Ok',
              customClass: {
                  confirmButton: "bg-danger"
              }
          })
          }
          await axios.post('https://digitaldining.onrender.com/api/modify_food_details_withImage', { oldName: data.item_name, itemName, price, category, fromTime, toTime, file_path: `files/${data.id}.${extension}` }).then((message) => {
            if(message.data.updated)
            {
              Swal.fire({
                icon: "success",
                title: "Changes Saved",
                confirmButtonText: "Ok"
              }).then((message) => {
                if (message.isConfirmed) {
                  navigate("/AdminModify")
                }
              })
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
      } 
        else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info').then((message) => {
          if (message.isConfirmed) {
            navigate("/AdminModify")
          }
        })
      }
    })
    edit_text.innerText = "Edit";
    item_name.setAttribute("disabled", "disabled");
    item_price.setAttribute("disabled", "disabled");
    item_from_time.setAttribute("disabled", "disabled");
    item_to_time.setAttribute("disabled", "disabled");
    item_img.setAttribute("disabled", "disabled");
    item_category.setAttribute("disabled", "disabled");
  }
}
return (
  <div className="container bg-white p-2 rounded" style={{ overflow: "hidden", fontFamily: "serif" }}>
    <div className="row d-flex justify-content-between align-items-center" >
      <div className="col-6  col-md-3 col-lg-2" style={{ wordBreak: "break-all" }}>
        <span style={{ color: "red" }}>Name:</span><br /><input disabled type="text" className="col-12" id={nameId} value={itemName} onChange={(e) => { setItemName(e.target.value) }} />
      </div>
      <div className="col-6  col-md-2 col-lg-1" >
        <span style={{ color: "red" }} >Price:</span><br />
        <div className="d-flex ">
          <span>₹</span><input disabled type="number" className="col-10" id={priceId} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <div className=" col-12 py-3 col-md-6 col-lg-3">
        <span style={{ color: "red" }} >Time:</span><br />
        <div className="d-flex ">
          <input disabled type="time" id={itemFromTimeId} value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
          <span style={{ color: "blue" }}>&nbsp;-&nbsp;</span>
          <input disabled type="time" id={itemToTimeId} value={toTime} onChange={(e) => setToTime(e.target.value)} />
        </div>
      </div>

      <div className="col-4 col-lg-2">
        <span style={{ color: "red" }}>Category:</span><br />
        <select disabled value={category} className="col-8" id={itemCategoryId} style={{ backgroundColor: "ButtonFace", color: "black", padding: "4px" }} onChange={(e) => setCategory(e.target.value)}>
          <option value={"Food"}>Food</option>
          <option value={"Juice"}>Juice</option>
          <option value={"Beverages"}>Beverages</option>
          <option value={"Snacks"}>Snacks</option>
        </select>
      </div>

      <div className=" col-8 py-3  col-lg-3" >
        <span style={{ color: "red" }}>Image(optional):</span><br />
        <input type="file" disabled accept=".jpg, .jpeg, .png" id={itemImgId} style={{ wordBreak: "break-all" }} onChange={(e) => ValidateFile(e)} />
        <div>{imgFormatError && <ErrorBox message="only .jpg, .jpeg, .png are allowed" />}</div>
      </div>

      <div className="col-12   row py-2 py-lg-0 d-flex align-items-center justify-content-center " >
        <div className="col-6 d-flex align-items-center justify-content-center " >
          {loader === true ? <LoadingButton css="btn col-12 btn-warning" /> :
            <button className="btn col-8 col-md-4 btn-warning d-flex align-items-center justify-content-center"  onClick={EnableEdit} >
              <div><img src={Edit} width="20px" height="19px" alt="Error" />&nbsp;
                <span id={editTextId}>Edit</span></div>
            </button>
          }
        </div>
        <div className="col-6 d-flex align-items-center justify-content-center ">
          <button className="btn col-8 col-md-4  d-flex align-items-center justify-content-center " style={{backgroundColor:"#E74C3C "}} onClick={DeleteItem}>
            <img src={Delete} width="35px" height="20px"  alt="Error" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>


  </div>
)
}
export default ModifyItem;