import Product from "../models/product.model.js";
import ProductCategory from "../models/productCategory.model.js";

export async function GetAllShopProducts(req, res) {
  try {
    // TODO: add paginations and query
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found !" });
    }

    return res
      .status(200)
      .json({ success: true, message: "products retrieved successfully", products });
  } catch (error) {
    console.log("error occurred while getting all products", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}
export async function GetAllMerchantShopProducts(req, res) {
  try {
    const userid = req.user.id;
    console.log("User id:", userid);
    const products = await Shop.find({ owner: userid });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found for this user" });
    }

    return res
      .status(200)
      .json({ success: true, message: "products retrieved successfully", products });
  } catch (error) {
    console.log("error occurred while getting all categories", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function CreateMerchantShopProduct(req, res) {
  try {
    const owner = req.user.id;
    const { name, description, contact } = req.body;
    const { category } = req.body; // category should be an existing category ObjectId

    if (!name || !description || !contact || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingShop = await Shop.findOne({ name });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Shop with this name already exists",
      });
    }

    const categoryExists = await ShopCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const shop = await Shop.create({
      name,
      description,
      contact,
      owner,
      category,
    });

    return res
      .status(200)
      .json({ success: true, message: "Shop created successfully", shop });
  } catch (error) {
    console.log("error occurred while creating shop: ", error);
    res.status(500).json({ message: error.message });
  }
}

export async function UpdateMerchantShopProduct(req, res) {
  try {
    const owner = req.user.id;
    const { name, description, contact } = req.body;
    const { category } = req.body; // category should be an existing category ObjectId

    if (!name || !description || !contact || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingShop = await Shop.findOne({ name });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Shop with this name already exists",
      });
    }

    const categoryExists = await ShopCategory.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const shop = await Shop.create({
      name,
      description,
      contact,
      owner,
      category,
    });

    return res
      .status(200)
      .json({ success: true, message: "Shop created successfully", shop });
  } catch (error) {
    console.log("error occurred while creating shop: ", error);
    res.status(500).json({ message: error.message });
  }
}

export async function DeleteMerchantShopProducts(req, res) {
  try {
    const userid = req.user.id;
    console.log("User id:", userid);
    const products = await Shop.find({ owner: userid });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found for this user" });
    }

    return res
      .status(200)
      .json({ success: true, message: "products retrieved successfully", products });
  } catch (error) {
    console.log("error occurred while getting all categories", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}
