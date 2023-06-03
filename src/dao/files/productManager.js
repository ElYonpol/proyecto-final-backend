const fs = require("fs");

class ProductManager {
	constructor(path) {
		this.path = path;
	}

	get = async () => {
		try {
			if (fs.existsSync(this.path)) {
				const products = await fs.promises.readFile(this.path, "utf-8");
				return JSON.parse(products);
			}
			throw new Error();
		} catch (error) {
			return error;
		}
	};

	validateFields = (newProduct) => {
		let areFieldsMissing =
			!newProduct.title ||
			!newProduct.description ||
			!newProduct.code ||
			!newProduct.price ||
			!newProduct.stock;

		return areFieldsMissing;
	};

	getByID = async (id) => {
		const products = await this.get();

		const productFound = products.find((product) => product.id === id);
		if (!productFound) {
			console.error("Product not found");
			return null;
		}

		console.log(productFound);

		return productFound;
	};

	create = async (newProduct) => {
		const products = await this.get();

		const { title, description, code, price, status, stock, thumbnails } =
			newProduct;

		products.length === 0
			? (newProduct.id = 1)
			: (newProduct.id = products[products.length - 1].id + 1);

		const areFieldsMissing = this.validateFields(newProduct);

		let productExists = products.some((prod) => prod.code === newProduct.code);

		if (areFieldsMissing) {
			console.log("Debe completar todos los campos");
			throw new Error("Debe completar todos los campos");
		}

		if (productExists) {
			console.log("El código ingresado ya existe");
			throw new Error("El código ingresado ya existe");
		}

		products.push({ ...newProduct, id: newProduct.id });

		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products, null, 2),
			"utf-8"
		);

		return newProduct;
	};

	update = async (pid,productToUpdate) => {
		const products = await this.get();

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

		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products, null, 2),
			"utf-8"
		);
	};

	delete = async (IdProductToDelete) => {
		const products = await this.get();

		const productFoundIndex = products.findIndex(
			(product) => product.id === IdProductToDelete
		);

		if (productFoundIndex === -1) {
			console.error("Product not found");
			return null;
		}

		console.log("El producto a eliminar es:", products[productFoundIndex]);
		products.splice(productFoundIndex, 1);

		await fs.promises.writeFile(
			this.path,
			JSON.stringify(products, null, 2),
			"utf-8"
		);
	};
}

const productMgr = new ProductManager("./src/files/products.json");

module.exports = { ProductManager, productMgr };
