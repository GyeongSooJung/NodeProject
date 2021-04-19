const Company = require('../schemas/company');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn,DataSet} = require('./middleware');


router.post('/pfupdate',isNotLoggedIn,DataSet,async(req,res,next)=>{
    const{ CNA, PN, MN, PW} = await req.body;
    console.log("CNA : " + CNA);
    console.log("PN : " + PN);
    console.log("PW : " + PW);
    console.log(req.decoded.company.PW);
    console.log(PW);
    
    try{
        
    if(bcrypt.compareSync( PW,req.decoded.company.PW)){
            console.log("CNA : " + CNA);
    console.log("PN : " + PN);
    console.log("PW : " + PW);
       const companyone = await Company.where({"_id" : req.decoded.company._id}).update({ "CNA": CNA, "PN":PN }).setOptions({ runValidators: true }).exec();
       console.log(companyone);
        return res.redirect('/profile?update=true');
    }else{
        return res.redirect('/profile?uperr=true');
    }
        
        }catch(err){
            console.error(err);
        }
    });


router.post('/pwchange',isNotLoggedIn,DataSet,async(req,res,next)=>{
    const {PW,PWc1,PWc2} = await req.body;
    const company = req.decoded.company;
    try{
        console.log('입력'+PW);
        console.log('현재'+company.PW);
        if(bcrypt.compareSync(PW, req.decoded.company.PW)){
            if(PW !==PWc1){
                if(8 <= PWc1.length){
                    if(PWc1 === PWc2){
                        const hash = await bcrypt.hash(PWc1, 12);
                        await console.log(hash);
                        await Company.update({"_id" : company._id},{PW : hash, UA : Date.now()});
                        return res.redirect('/profile?success=true');
                    }
                    else{
                        return res.redirect('/profile?pwcerr=true');
                    }
                }else{
                    return res.redirect('/profile?pwc=true');
                }
            }else{
                return res.redirect('/profile?same=true');
            }
        }else{
            return res.redirect('/profile?pwerr=true');
        }
    }catch(err){
        console.error(err);
    }
});


module.exports = router;