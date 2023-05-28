class RepositoryGeneric {
	constructor(dao) {
		this.dao = dao;
	}

	async getItems() {
		return await this.dao.get();
	}
	async getItem(id) {
		return await this.dao.getById(id);
	}
	async createItem(newItem) {
		return await this.dao.create(newItem);
	}
	async updateItem(id, itemToUpdate) {
		return await this.dao.update(id, itemToUpdate);
	}
	async deleteItem(id) {
		return await this.dao.delete(id);
	}
}

module.exports = RepositoryGeneric;
