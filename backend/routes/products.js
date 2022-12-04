const express = require("express");
const { Product } = require("../models/product");
const cloudinary = require("../utils/cloudinary");
const {isAdmin} = require("../middleware/auth")

const router = express.Router();

//CREATE PRODUCT ENDPOINT
router.post("/", isAdmin, async(req, res)=>{
    const {name, brand, desc, price, image} = req.body;
    try{
        if(image){
            const uploadRes =await cloudinary.uploader.upload(image, {
                upload_preset: "maishasoko"
            })
            if(uploadRes){
                const product = new Product({
                    name,
                    brand,
                    desc,
                    price,
                    image: uploadRes
                })
                const savedProduct = await product.save();
                res.status(200).send(savedProduct);
            }
        }
    }catch(error){
        console.log(error)
        res.status(500).send(error);
    }
});
//get all products
router.get("/", async(req, res) =>{
    try{
        const products = await Product.find()
        res.status(200).send(products)
    }catch(error){
        console.log(error)
        res.status(500).send(error)
    }
  

})
// get product

router.get("/find/:id", async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).send(product)
    }catch(error){
        console.log(error)
        res.status(500).send(error)
    }
  

})

//delete product
router.delete("/:id", isAdmin, async(req, res) =>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product) return res.status(404).send("product not found...");
        if(product.image.public_id){
            const destroyResponse = await cloudinary.uploader.destroy(
                product.image.public_id
            );
            if(destroyResponse){
                const deletedProduct = await Product.findByIdAndDelete(req.params.id);
                res.status(200).send(deletedProduct);
            }
        }else{
            console.log("Action terminated. Failed to delete target image");
        }
    }catch(error){
        res.status(500).send(error)
    }
  

})

//Edit products



module.exports = router;