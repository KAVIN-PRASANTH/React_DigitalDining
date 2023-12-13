import React from "react";
import Tick from "../Pictures/TickGif.gif"
import "../CSS_Files/Login.css";
function Popup(props) {
    function ButtonClick() {
        document.getElementById("pop_box").style.marginTop = "-1000px";
    }
    return (
        <div className="col-9 col-sm-5 rounded bg-white" id="pop_box" style={{transition:"1s"}}>
            <div>
            <div className="align_center" style={{marginTop:"-8px"}}>
                    <img className="col-5 col-md-4" src={Tick}  alt="Error" />
            </div>
            <div className="text-center"  style={{marginTop:"-20px"}} id={props.setTextBoxId}>
                {props.message}
            </div>
            <div className="align_center py-4" style={{ marginTop: "-10px" }} id={props.setId} >
                <button className="btn col-3 btn-primary " onClick={ButtonClick} >OK</button>
            </div>
            </div>
        </div>




    )
}
export default Popup;