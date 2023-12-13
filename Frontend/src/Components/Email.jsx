import React from "react";
import Tick from '../Pictures/tick-.png';
import Wrong from '../Pictures/wrong.png';
function Email(props) {
  return (
    <div className="row bg-white box_style font_style"  >
      <div className="col-1 d-flex justify-content-center align-items-center">  
      <i className="fa-solid fa-envelope" >&nbsp;&nbsp;|</i>
      </div>
      <div className="col-md-7 col-8 " style={{marginLeft:"-10px"}}>
          <input className="Input_box" id={props.setId}  placeholder={props.placeHolderName} required />
      </div>
      <div className="col-1">
        <img id="Email_tickimg" src={Tick} className="Tick_style" alt="Error" />
        <img id="Email_wrongimg" src={Wrong} className="Wrong_style" alt="Error" />
      </div>
    </div>

  );
}
export default Email;