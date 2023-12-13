function EmailOtpValidation(inputRandomNumber,randomNumber){ 
   if(inputRandomNumber.length===5 && inputRandomNumber===randomNumber)
    return true;
   return false;
}
export default EmailOtpValidation;