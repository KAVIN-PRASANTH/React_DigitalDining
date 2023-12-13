const bcrypt=require("bcryptjs");

const hashGenerate=async (text)=>{
    //Generating salt with 10 rounds
    const salt=await bcrypt.genSalt(20);
    const hash=await bcrypt.hash(text,salt);
    return hash;
}
module.exports.hashGenerate=hashGenerate;

const hashValidation=async (text,hashedText)=>{
    const result=await bcrypt.compare(text,hashedText);
    return result;
}
module.exports.hashValidation=hashValidation;