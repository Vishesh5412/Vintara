import ProductModel from "../../models/ProductModel";

export default async function getProductByCateory(req, res){
   if (req.method !== "POST"){
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
   }
   try{
     const {category, sort} = req.body;
     let productArr = await ProductModel.find({category});
     if (productArr.length === 0){
        console.log('Nothing to sort');
        return res.status(200).json({message: 'Nothing to sort'});
     }
     if (sort === 'priceLowHigh') {
        productArr.sort((a, b) => a.price - b.price);
      } else if (sort === 'priceHighLow') {
        productArr.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        productArr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return res.status(200).json({message: 'Success', productArr});
   }catch(err){
    console.log('Unable to sort items');
    res.status(500).json({message: 'Something went wrong'});
   }
}