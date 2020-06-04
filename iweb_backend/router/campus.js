const express=require('express')
const pool=require('../pool.js')
const router=express.Router()

module.exports=router
router.get('',(req,res,next)=>{
	let pageNum=parseInt(req.query.pageNum)
	let pageSize=4
	if(!pageNum){
		pageNum=1
	}
	let sql='SELECT cid,cname,address,phone,postcode FROM campus LIMIT ?,?'
	pool.query(sql,[(pageNum-1)*pageSize,pageSize],(err,reslut)=>{
		if(err){
			next(err)
			return
		}
		res.send(reslut)
	})
})