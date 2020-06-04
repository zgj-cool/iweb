const express=require('express')
const pool=require('../pool.js')
const router=express.Router()

module.exports=router
router.get('',(req,res,next)=>{
	let sql='SELECT bid,bannerPic FROM banner order by bid DESC LIMIT 4'
	pool.query(sql,(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})

