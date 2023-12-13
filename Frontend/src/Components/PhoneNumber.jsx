import React from "react";
import Tick from '../Pictures/tick-.png';
import Wrong from '../Pictures/wrong.png';
function PhoneNumber(props) {
    return (
        <>
            <div className="form_box">
                &nbsp;&nbsp;&nbsp;<input type="number" min={1000000000} max={9999999999} id={props.setId} className="Input_box" placeholder={props.placeHolderName} required autoComplete="off"/>
                <i class="fa-solid fa-mobile-retro">&nbsp;&nbsp;|&nbsp;</i>
                <img id="Phone_tickimg" src={Tick} className="Tick_style" />
                <img id="Phone_wrongimg" src={Wrong} className="Wrong_style" />
            </div>
        </>
    );
}
export default PhoneNumber; 