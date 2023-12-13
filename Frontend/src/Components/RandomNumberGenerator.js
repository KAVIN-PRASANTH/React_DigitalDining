function RandomNumberGenerator(){
    let number1 = Math.floor(Math.random() * 10) + '';
    let number2 = Math.floor(Math.random() * 10) + '';
    let number3 = Math.floor(Math.random() * 10) + '';
    let number4 = Math.floor(Math.random() * 10) + '';
    let number5 = Math.floor(Math.random() * 10) + '';
    const RandomNumber =number1+number2+number3+number4+number5;
    return RandomNumber;
}
export default RandomNumberGenerator;