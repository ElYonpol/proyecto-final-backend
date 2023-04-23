// const fs = require("fs");
const { productModel } = require("./models/productsModelMongo.js");

class ProductManagerMongo {
	// constructor(path) {
	// 	this.path = path;
	// }

	getProducts = async ({ page, limit, query = "" }) => {
		try {
			// const resp = await productModel.find().lean();
			const resp = await productModel.paginate({}, { limit, page, lean: true });
			return resp;
		} catch (error) {
			return error;
		}
	};

	getProductByID = async (id) => {
		const products = await this.getProducts();

		const productFound = products.find((product) => product.id === id);
		if (!productFound) {
			console.error("Product not found");
			return null;
		}

		console.log(productFound);

		return productFound;
	};

	//Función para validar que los campos estén bien para agregar un producto
	validateFields = (newProduct) => {
		let areFieldsMissing =
			!newProduct.title ||
			!newProduct.description ||
			!newProduct.code ||
			!newProduct.price ||
			!newProduct.stock;

		return areFieldsMissing;
	};

	addProduct = async (newProduct) => {
		const products = await this.getProducts();

		const areFieldsMissing = this.validateFields(newProduct);

		let productExists = products.some((prod) => prod.code === newProduct.code);

		let pid = 0;

		products.length === 0
			? (pid = 1)
			: (pid = products[products.length - 1].pid + 1);
		newProduct.pid = pid;

		if (areFieldsMissing) {
			console.log("Debe completar todos los campos");
			throw new Error("Debe completar todos los campos");
		}

		if (productExists) {
			console.log("El código ingresado ya existe");
			throw new Error("El código ingresado ya existe");
		}

		console.log("Producto a agregar", newProduct);

		return await productModel.create(newProduct);
	};

	updateProduct = async (pid, productToUpdate) => {
		const products = await this.getProducts();

		const productFoundIndex = products.findIndex(
			(product) => product.id === pid
		);
		if (productFoundIndex === -1) {
			console.error("Product not found");
			return null;
		}

		products[productFoundIndex] = {
			...products[productFoundIndex],
			...productToUpdate,
		};
		console.log("El Producto actualizado es:", products[productFoundIndex]);

		return await productModel.updateOne(
			{ _id: pid },
			products[productFoundIndex]
		);
	};

	deleteProduct = async (IdProductToDelete) => {
		const products = await this.getProducts();

		const productFoundIndex = products.findIndex(
			(product) => product.id === IdProductToDelete
		);

		if (productFoundIndex === -1) {
			console.error("Product not found");
			return null;
		}

		console.log("El producto a eliminar es:", products[productFoundIndex]);

		return await productModel.deleteOne({ _id: IdProductToDelete });
	};
}

const productMgr = new ProductManagerMongo();

module.exports = { ProductManagerMongo, productMgr };
