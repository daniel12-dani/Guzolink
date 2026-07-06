import Product from "../models/product.model.js";
import Shop from "../models/shop.model.js";

export async function GetAllShopProducts(req, res) {
  try {
    const products = await Product.find().populate("shop", "name location").populate("category", "name");

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found!" });
    }

    return res.status(200).json({ success: true, message: "Products retrieved successfully", products });
  } catch (error) {
    console.log("Error occurred while getting all products", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function GetAllMerchantShopProducts(req, res) {
  try {
    const { shopId } = req.params;
    const products = await Product.find({ shop: shopId }).populate("category", "name");

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this shop" });
    }

    return res.status(200).json({ success: true, message: "Products retrieved successfully", products });
  } catch (error) {
    console.log("Error occurred while getting shop products", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function CreateMerchantShopProduct(req, res) {
  try {
    const owner = req.user.id;
    const { name, description, price, stock, category, shop: shopId, image } = req.body;

    if (!name || !price || !category || !shopId) {
      return res.status(400).json({ success: false, message: "Name, price, category, and shop are required" });
    }

    const existingShop = await Shop.findOne({ _id: shopId, owner });
    if (!existingShop) {
      return res.status(403).json({ success: false, message: "Unauthorized or shop does not exist" });
    }

    let product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      shop: shopId,
      image,
    });
    product = await product.populate("category", "name");

    return res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    console.log("Error occurred while creating product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function UpdateMerchantShopProduct(req, res) {
  try {
    const owner = req.user.id;
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id).populate("shop");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (String(product.shop.owner) !== String(owner)) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this product" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true }).populate("category", "name");

    return res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.log("Error occurred while updating product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function DeleteMerchantShopProducts(req, res) {
  try {
    const owner = req.user.id;
    const { id } = req.params;

    const product = await Product.findById(id).populate("shop");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (String(product.shop.owner) !== String(owner)) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this product" });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error occurred while deleting product", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
