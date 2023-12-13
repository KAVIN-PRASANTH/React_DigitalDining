
function ErrorBox(props) {
    return (
        <div className="row d-flex align-items-center" style={{ backgroundColor: "#FF7F7F" }}>
            <div className="col-2 col-sm-1">
                <i className="col-1 fa-solid fa-circle-exclamation" style={{ color: 'red' }}></i>
            </div>
            <div className="col-10  small" id="error_message" align="left">
                       {props.message}
            </div>
        </div>

    )
}
export default ErrorBox;