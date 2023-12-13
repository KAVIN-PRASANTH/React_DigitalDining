import React from "react";
function Otp(props) {
   let prefixName=props.prefixName;
    function OtpCursorFocus(k, idNum) {
        if(Number(k.target.value)>9 || (k.target.value+"").length>=2)
        {
            k.target.value=Number(k.target.value%10);
        }
        if (k.key === " ")
            k.target.value = "";
        if ((k.key - '0' >= 0 && k.key - '0' <= 9) || k.key === "ArrowUp" || k.key === "ArrowDown" || k.key === "ArrowLeft" || k.key === "ArrowRight" || k.key === "Backspace" ||
            k.key === "Enter" || k.key === " ") {

            if (k.key - '0' >= 0 && k.key - '0' <= 9) {
                idNum++;
            }
            else {
                switch (k.key) {
                    case "ArrowUp": idNum++; break;
                    case "ArrowDown": idNum--; break;
                    case "ArrowLeft": idNum--; break;
                    case "ArrowRight": idNum++; break;
                    case "Backspace": idNum--; break;
                    case "Enter": idNum++; break;
                    case " ": idNum++; break;
                    default:break;
                }
            }
            if (idNum > 5)
                idNum = 1;
            if (idNum < 1)
                idNum = 5;
            document.getElementById(prefixName+idNum).focus();

        }
    }
    return (
        <div id="otp_container">
            <div>
                <input onKeyUp={(e) => OtpCursorFocus(e, 1)} type="number" max="1" placeholder="*" className="otp_box" id={props.setId1} autoComplete="off"/>&nbsp;&nbsp;
            </div>
            <div >
                <input onKeyUp={(e) => OtpCursorFocus(e, 2)} type="number" max="1" placeholder="*" className="otp_box" id={props.setId2}  autoComplete="off"/>&nbsp;&nbsp;
            </div>
            <div >
                <input onKeyUp={(e) => OtpCursorFocus(e, 3)} type="number" max="1" placeholder="*" className="otp_box" id={props.setId3}  autoComplete="off"/>&nbsp;&nbsp;
            </div>
            <div >
                <input onKeyUp={(e) => OtpCursorFocus(e, 4)} type="number" max="1" placeholder="*" className="otp_box" id={props.setId4}  autoComplete="off"/>&nbsp;&nbsp;
            </div>
            <div >
                <input onKeyUp={(e) => OtpCursorFocus(e, 5)} type="number" max="1" placeholder="*" className="otp_box" id={props.setId5}  autoComplete="off"/>
            </div>
        </div>
    );
}
export default Otp;