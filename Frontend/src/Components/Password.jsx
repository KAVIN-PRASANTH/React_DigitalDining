import React from "react";
import Tick from '../Pictures/tick-.png';
import Wrong from '../Pictures/wrong.png';
function Pass(props) {
    return (
        <div className="row bg-white box_style font_style" >
            <div className="col-1 d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-lock">&nbsp;&nbsp;|</i>
            </div>
            <div className="col-md-7 col-8" style={{ marginLeft: "-10px" }}>
                <input type="password" id={props.setId} className="Input_box" placeholder={props.placeHolderName} />
            </div>
            <div className="col-1">
                <img id={props.setIdTickImg} src={Tick} className="Tick_style" alt="Error" />
                <img id={props.setIdWrongImg} src={Wrong} className="Wrong_style" alt="Error" />
            </div>
            
        </div>
    );
}
export default Pass;