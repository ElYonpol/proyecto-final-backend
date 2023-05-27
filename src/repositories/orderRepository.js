class OrderRepository {
	constructor(dao) {
		this.dao = dao;
	}

    async getOrders(){
        return await this.dao.get();
    }
    async getOrder(oid){
        return await this.dao.getById(oid)
    }
    async createOrder(){
        return await this.dao.create()
    }
    async updateOrder(oid){
        return await this.dao.update(oid)
    }
    async deleteOrder(oid){
        return await this.dao.delete(oid)
    }
}

module.exports = OrderRepository;
