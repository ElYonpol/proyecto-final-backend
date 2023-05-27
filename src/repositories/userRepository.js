const UserDto = require("../dto/userDto");

class UserRepository {
    constructor(dao){
        this.dao = dao;
    }

    getUsers = async (filter, specs)=>{
        let result = await this.dao.get(filter,specs);
        return result;
    }

    createUser = async (user)=>{
        let newUser = new UserDto(user);
        let result = await this.dao.create(newUser)
        return result;
    }
}

module.exports = UserRepository