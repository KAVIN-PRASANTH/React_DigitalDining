
function EmailValidation(emailName){
   const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(emailName);
}

export default EmailValidation;