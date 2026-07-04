import Shop from "../models/shop.model.js";
import ShopCategory from "../models/shopCategory.model.js";


export async function CreateMerchantShop(req, res) {
    try{
        const owner = req.user.id;
        const {name, description, contact  } = req.body;
        const { category } = req.body; // category should be an existing category ObjectId
        
        if(!name || !description || !contact || !category){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        
        const existingShop = await Shop.findOne({ name });
        if(existingShop){
            return res.status(400).json({ success: false, message: "Shop with this name already exists" });
        }

        const categoryExists = await ShopCategory.findById(category);
        if(!categoryExists){
            return res.status(400).json({ success: false, message: "Invalid category" });
        }

        const shop = await Shop.create({
            name,
            description,
            contact,
            owner,
            category
        });

        return res.status(200).json({ success: true, message: "Shop created successfully", shop });
    }catch(error){
        console.log("error occurred while creating shop: ", error)
        res.status(500).json({ message: error.message });
    
    }
}

export async function GetAllMerchantShops(req, res ){
    try{
        const userid  =  req.user.id
        console.log("User id:", userid)
        const shops = await Shop.find({owner: userid})

        if(!shops || shops.length === 0){
            return res.status(404).json({ success: false, message: "No shops found for this user" });
        }

        return res.status(200).json({ success: true, message: "Shops retrieved successfully", shops });

    }catch(error){
        console.log("error occurred while getting all categories", error)
        return res.status(404).json({
            success:false,
            message: error.message
        })
    }
}