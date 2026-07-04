import mongoose from "../utils/mongoose.util.js";

const shopSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},

	description: {
		type: String,
	},
	owner: {
		type: String,
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
	},
	publishdate: {
		type: String,
		required: true,
	},
	pages: {
		type: Number,
	},
	rating: {
		type: Number,
	},
	price: {
		type: Number,
	},
	language: {
		type: String,
	},

	publisher: {
		type: String,
	},
	posterimage: {
		type: String,
		default: "",
	},

	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

const BookModel = mongoose.model("Book", BookSchema);
export default BookModel;
