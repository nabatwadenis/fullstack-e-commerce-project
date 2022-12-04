const { Order } = require("../models/order");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const moment = require("moment");

const router = require("express").Router();


//get orders

router.get("/", isAdmin, async(req, res) => {

    const query = req.query.new
    try{
        const orders = query ? await Order.find().sort({_id: -1}).limit(4) : 
        await Order.find().sort({_id: -1})

        res.status(200).send(orders);


    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
})
//get order stats

router.get("/stats", isAdmin, async( req, res) =>{
    const previousMonth = moment()
        .month(moment().month() - 1)
        .set("date", 1)
        .format("YYYY-MM-DD HH:mm:ss");
    try{
        const orders = await Order.aggregate([
            {$match: {createdAt: {$gte: new Date(previousMonth)}}},
            {$project: {month: {$month: "$createdAt"}}},
            {$group:{
                _id: "$month",
                total: {$sum: 1}
            }}
        ]);
        res.status(200).send(orders);

    }catch(err){
        res.status(500).send(err)
    }
});

//get income stats

router.get("/income/stats", isAdmin, async( req, res) =>{
    const previousMonth = moment()
        .month(moment().month() - 1)
        .set("date", 1)
        .format("YYYY-MM-DD HH:mm:ss");
    try{
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: new Date(previousMonth)}}},
            {$project: {month: {$month: "$createdAt"}, sales:"$total" }},
            {$group:{
                _id: "$month",
                total: {$sum: "$sales"}
            }}
        ]);
        res.status(200).send(income);

    }catch(err){
        res.status(500).send(err)
    }
});

//chart 1 week  sales
router.get("/week-sales", isAdmin, async( req, res) =>{
    const last7Days = moment()
        .day(moment().day() - 7)
        .format("YYYY-MM-DD HH:mm:ss");
    try{
        const sales = await Order.aggregate([
            {$match: {createdAt: {$gte: new Date(previousMonth)}}},
            {$project: {day: {$dayOfWeek: "$createdAt"}, sales: "$sales"}},
            {$group:{
                _id: "$day",
                total: {$sum: "$sales"}
            }}
        ]);
        res.status(200).send(sales);

    }catch(err){
        res.status(500).send(err)
    }
});

//update Order
router.put("/:id", isAdmin, async(req, res) =>{
    try{
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new: true},
        );
        res.status(200).send(updateOrder)
    }catch(err){
        res.status(500).send(err);
    }
});


module.exports = router;