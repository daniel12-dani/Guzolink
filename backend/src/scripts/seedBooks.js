import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import mongoose from "../utils/mongoose.util.js";
import { DB_URL } from "../configs/database.config.js";
import BookModel from "../models/book.model.js";
import CategoryModel from "../models/category.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "../data/data.json");

async function seedBooks() {
	await mongoose.connect(DB_URL);

	const raw = await fs.readFile(dataFile, "utf8");
	const books = JSON.parse(raw);

	await BookModel.collection.drop().catch(() => {});
	await CategoryModel.collection.drop().catch(() => {});

	const deletedBooks = await BookModel.deleteMany({});
	const deletedCategories = await CategoryModel.deleteMany({});

	const categoryMap = new Map();
	for (const book of books) {
		const categoryName = book.category || "General";
		if (categoryMap.has(categoryName)) {
			continue;
		}

		const category = await CategoryModel.create({
			name: categoryName,
		});
		categoryMap.set(categoryName, category._id);
	}

	const preparedBooks = books.map((book) => ({
		title: book.title,
		description: book.description,
		author: book.author,
		category: categoryMap.get(book.category || "General"),
		publishdate: book.publishdate,
		pages: book.pages,
		rating: book.rating,
		price: book.price,
		language: book.language,
		publisher: book.publisher,
		posterImage: book.posterImage,
	}));

	await BookModel.insertMany(preparedBooks);

	console.log(
		`Cleared ${deletedBooks.deletedCount || 0} books and ${deletedCategories.deletedCount || 0} categories.`,
	);
	console.log(
		`Seeded ${preparedBooks.length} books and ${categoryMap.size} categories.`,
	);
	await mongoose.disconnect();
}

seedBooks().catch(async (error) => {
	console.error("Failed to seed books:", error);
	await mongoose.disconnect();
	process.exit(1);
});
