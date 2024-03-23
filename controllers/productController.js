const Product = require('../models/Product');

// create product
exports.createProduct = async (req, res, next) => {
  try {
    const {
      itemName,
      subCategory,
      modelNo,
      coverImage,
      image,
      images,
      specifications,
    } = req.body;

    const product = await Product.create({
      itemName,
      subCategory,
      modelNo,
      coverImage,
      image,
      images,
      specifications,
    });

    specifications.set('products', specifications.products);

    return res.status(200).json({
      status: 'success',
      message: 'product created successfully',
      data: product,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'fail', message: 'Internal server error' });
  }
};

exports.getProductById = async (req,res,next)=>{
  const {id} = req.params.id;

  try {
    
  const product = await product.findById(id);
  res.status(200).json(product);
    
  } catch (error) {
    res.status(400).send(error);
  }

};

exports.getProducts = async (req,res,next)=>{

  try {

    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);

  }
  
};

exports.deleteProduct = async(req,res,next)=>{
  const {id} = req.params.id;

  try {
    const product = await findById(id);

    if(!product){
      return res.status(400).send("Product Not Found");
    }else{
      product.remove();
      res.status(200).send("Product Removed Succesfullly",id);
    }


  } catch (error) {
    throw new Error(error);
  }
};

exports.updateCourse = async(req,res,next)=>{
  const {id} = req.params.id;
  const data = req.body;

  try {
    const product = await Product.findById(id);
    if(!product){
      res.status(400).send("Product Not Found")
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      data,
      {new:true}
    );
    
    res.status(200).send(updateProduct);

  } catch (error) {
    res.status(400).send(error);
  }
};
