import React from "react";
function Button(props) {
    return (
        <button className={props.css} >{props.name}</button>
    );
}
export default Button;