import connectToDatabase from "../../config/mongoose";
import UserModel from "../../models/UserModel"

export default async function updateCart(req, res){
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }
     await connectToDatabase();
     try{
       const {userId, userCart} = req.body;
       if (!userId || !userCart){
        return res.status(400).json({message: "Missing id or cart array"});
       }
       const user = await UserModel.findById(userId);
       if (!user){
        return res.status(404).json({message: 'User not found'});
       }
       user.cart  = userCart;
       await user.save();  
       return res.status(200).json({message: 'Cart updated successfully', userCart});
     }catch(err){
       console.log('Unable to update user cart');
       res.status(500).json({message : 'Somthing went wrong'});
     }
}
