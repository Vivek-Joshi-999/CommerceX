const Cart = require("../models/Cart")
const Product = require("../models/Product")

const addToCart = async (req,res,next)=>{
    try{
        const {productId,quantity}=req.dody;

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found",
            })
        }
    }
}