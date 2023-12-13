import PropagateLoader from 'react-spinners/PulseLoader';

function LoadingButton(props){
    return(
      <div>
        <button className={props.css} ><PropagateLoader size={10}  color="black"/></button>
      </div>
    )
}
export default LoadingButton;