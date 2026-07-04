import mongoose from "../utils/mongoose.util.js";


const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

const ProductModel = mongoose.model("Product", ProductSchema);
export default ProductModel;