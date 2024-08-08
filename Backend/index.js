const express=require("express")
const mongoose=require("mongoose")
const app=express()
const bodyParser=require("body-parser")
const dotEnv=require("dotenv")
const cors=require("cors")
const Bcrypt=require("bcrypt")
const json=require("jsonwebtoken")
const joi=require("joi")
const { error } = require("console")




app.use(bodyParser.json())
app.use(cors({
    exposedHeaders: ['token']
}))
dotEnv.config()

let PORT=process.env.PORT

let ProductSchema=new mongoose.Schema({
    name:String,
    price:Number
})


let UserSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String
})



let Productvalidationschema= joi.object({
    name:joi.string().min(4).max(20).required(),
    price:joi.number().integer().positive().min(10).max(40000).required()
})


let ProductModel= mongoose.model("product",ProductSchema)

let UserModel=mongoose.model("user",UserSchema)

let tokenControl=function(req,res,next){
    let token=req.header("token")

    if(!token){
        return res.send("tokenin yoxdur")

    }


    try{
        let decodedToken=json.verify(token,"jwtsecretkey")
        // res.send(decodedToken)
        next()
    } catch(err){
        res.send("token yanlisdir")
    }


    // let decodedToken=json.verify(token,"jwtsecretkey")
    // res.send(decodedToken)


   
}



app.get("/products",tokenControl ,async(req,res)=>{
    let products= await ProductModel.find()
    res.send(products)
})

app.post("/products",async(req,res)=>{
    let {error}=Productvalidationschema.validate(req.body)
    if(error){
        return res.send(error.details[0].message)
    }

    let newProduct=ProductModel(req.body)
    await newProduct.save()
    res.send(newProduct)
})

app.delete("/products/:id", tokenControl, async (req, res) => {
    try {
        let result = await ProductModel.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send("Product not found");
        }
        res.send(result);
    } catch (err) {
        res.status(500).send("Error deleting product");
    }
});

app.post("/users/register", async (req,res)=>{
    let user= await UserModel.findOne({email:req.body.email})
    if(user){
        res.send("Bu email var ")
    }
    let hashedpassword=await Bcrypt.hash(req.body.password,10)

    let newUser= new UserModel({
        name:req.body.name,
        email:req.body.email,
        password:hashedpassword
    })
    await newUser.save()
    // res.send(newUser)



    app.put("/products/:id", tokenControl, async (req, res) => {
        let { error } = ProductValidationSchemma.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
    
        try {
            let updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).send("Product not found");
            }
            res.send(updatedProduct);
        } catch (err) {
            res.status(500).send("Error updating product");
        }
    });


    let token =await json.sign({_id:newUser._id},"jwtsecretkey")

    res.header("token",token).send(newUser)


})


app.post("/users/login", async (req,res)=>{

    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
        return res.send("Bele istifadeci yoxdur")
    }
    
    let isPassword= await Bcrypt.compare(req.body.password,user.password)

    if(!isPassword){
       return res.send("parol sehvdir") 
    }



    let token=json.sign({_id:user._id},"jwtsecretkey")

    res.send({token:token})
})


mongoose.connect(process.env.DB_CONNECTED)
.then(res=>{
    console.log("connected")
})
.catch(err=>{
    console.log(err)
})

app.listen(PORT,()=>{
    console.log(`${PORT} portu islekdir`)
})