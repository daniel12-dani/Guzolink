import mongoose from "../utils/mongoose.util.js";

const CategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		shop: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Book",
			},
		],
	},

	{
		timestamps: true,
	},
);

const CategoryModel = mongoose.model("Category", CategorySchema);
export default CategoryModel;
