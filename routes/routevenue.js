const express=require("express");
const { allVenue, Ownerdet, GetVen,NewUser,LoginUser, addVenue } = require('../controllers/control');
const upload=require("../config/photoupload")
const app=express();
const router=express.Router();
router.get("/getallvenue",allVenue);
router.get("/ownerdetail",Ownerdet);
router.post("/getvenuebyid",GetVen);
router.post('/adduser',NewUser);
router.post('/loginuser',LoginUser);
router.post('/addvenue',upload,addVenue);
module.exports=router;
