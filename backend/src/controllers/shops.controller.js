import Shop from "../models/shop.model.js";
import ShopCategory from "../models/shopCategory.model.js";

export async function CreateMerchantShop(req, res) {
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

export async function GetMerchantShops(req, res) {
  try {
    const userid = req.user.id;
    const shops = await Shop.find({ owner: userid }).populate(
      "category",
      "name",
    );

    if (!shops || shops.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No shops found for this user please add new shop",
        shops: [],
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Shops retrieved successfully", shops });
  } catch (error) {
    console.log("error occurred while getting all categories", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function GetAllShops(req, res) {
  try {
    // GET /shops/all?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Get total number of shops
    const totalShops = await Shop.countDocuments();

    // Fetch paginated shops
    const shops = await Shop.find({})
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (shops.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No shops found",
        shops: [],
        pagination: {
          totalItems: totalShops,
          totalPages: Math.ceil(totalShops / limit),
          currentPage: page,
          pageSize: limit,
        },
      });
    }
    console.log(
      "Total shops:",
      totalShops,
      "Current page:",
      page,
      "Limit:",
      limit,
    );
    return res.status(200).json({
      success: true,
      message: "Shops retrieved successfully",
      data: shops,
      pagination: {
        totalItems: totalShops,
        totalPages: Math.ceil(totalShops / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page * limit < totalShops,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error getting shops:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function GetMerchantShopDetails(req, res) {
  try {
    const { id } = req.params;
    const existingShop = await Shop.findOne({ _id: id }).populate(
      "category",
      "name",
    );

    if (!existingShop) {
      return res.status(400).json({
        success: false,
        message: "Shop not found with given id ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop detials retrieved successfully",
      shop: existingShop,
    });
  } catch (error) {
    console.log("error occurred while getting all categories", error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
}

export async function DeleteMerchantShop(req, res) {
  try {
    const { id, role } = req.user;
    const { shopId } = req.params;

    // find the shop first
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No shop found for this user please add new shop",
        shop: [],
      });
    }

    // check ownership

    const isShopOwner = shop.createdBy?.toString() === id;
    if (!isShopOwner && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this shop.",
      });
    }
    await Shop.findOneAndDelete({
      _id: shopId,
      createdBy: id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Shops deleted successfully" });
  } catch (error) {
    console.log("error occurred while getting all categories", error);
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
}

export async function UpdateMerchantShop(req, res) {
  try {
    const { id, role } = req.user;
    const { shopId } = req.params;
    const { name, description, contact, category } = req.body;

    // find the shop first
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No shop found with this id ! for this user",
        shop: [],
      });
    }

    // check ownership
    const isShopOwner = shop.createdBy.toString() === id;
    if (!isShopOwner && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this shop.",
      });
    }

    // Update the shop details
    const updatedShop = await Shop.findOneAndUpdate(
      { _id: shopId, createdBy: id },
      { name, description, contact, category },
      { returnDocument: "after" }, // Return the updated document
    );

    return res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      shop: updatedShop,
    });
  } catch (error) {
    console.log("error occurred while updating merchant shop", error);
    return res.status(500).json({
      success: false,
      message: "error occurred while updating merchant shop",
    });
  }
}
