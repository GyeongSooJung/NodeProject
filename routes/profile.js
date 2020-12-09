const Company = require('../schemas/company');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn,DataSet} = require('./middleware');


router.post('/pfupdate',isNotLoggedIn,DataSet,async(req,res,next)=>{
    const{ CNA, PN, MN, PW} = await req.body;
    try{
        
    if(bcrypt.compareSync( PW,req.decoded.PW)){
        await Company.update({"_id" : req.decoded._id},{CNA, PN});
        return res.redirect('/profile?update=true');
    }else{
        return res.redirect('/profile?uperr=true');
    }
        
        }catch(err){
            console.error(err);
        }
    });


router.post('/pwchange',isNotLoggedIn,DataSet,async(req,res,next)=>{
    const {PW,PWc1,PWc2} = await req.body
    try{
        if(bcrypt.compareSync( PW,req.decoded.PW)){
            if(PW !==PWc1){
                if(8 <= PWc1.length){
                    if(PWc1 === PWc2){
                        const hash = await bcrypt.hash(PWc1, 12);
                        await console.log(hash);
                        await Company.update({"_id" : req.decoded._id},{PW : hash, UA : Date.now()});
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