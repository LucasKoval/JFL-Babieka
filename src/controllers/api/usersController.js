//----------* REQUIRE'S *----------//
const db = require('../../db/models');


//----------* USERS CONTROLLER *----------//
const usersController = {
    // URL: http://localhost:3030/api/users/
    // Renderiza la vista Listado de Usuarios
    list: async (req, res) => { 
        const allUsers = await db.User.findAndCountAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'image'],
            include: ['role']
        });
        const users = allUsers.rows.map(user => {
            return (
                user.dataValues.urlImage = `http://localhost:3030/img/users/${user.image}`,
                user.dataValues.urlDetail = `http://localhost:3030/api/users/${user.id}`,
                user
            )
        });
        const manager = users.filter((user) => {
            return user.role.name == 'manager';
        });
        const admin = users.filter((user) => {
            return user.role.name == 'admin';
        });
        const developer = users.filter((user) => {
            return user.role.name == 'developer';
        });
        const tester = users.filter((user) => {
            return user.role.name == 'tester';
        });
        const client = users.filter((user) => {
            return user.role.name == 'client';
        });
		res.json({
			meta: {
                status: 'success',
                count: allUsers.count,
                count_Role_Manager: manager.length,
                count_Role_Admin: admin.length,
                count_Role_Developer: developer.length,
                count_Role_Tester: tester.length,
                count_Role_Client: client.length
            },
            data: {
                users
            }
        });
    },

    // URL: http://localhost:3030/api/users/list
    // Renderiza la vista Listado paginado de Usuarios
    paginatedList: async (req, res) => {
        const page = Number(req.query.page) || 1;
        const allUsers = await db.User.findAndCountAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'image'],
            include: ['role'],
            limit: 4,
            offset: 4 * (page - 1)
        });
        const totalPages = Math.ceil(allUsers.count / 4) 
        const users = allUsers.rows.map(user => {
            return (
                user.dataValues.urlImage = `http://localhost:3030/img/users/${user.image}`,
                user.dataValues.urlDetail = `http://localhost:3030/api/users/${user.id}`,
                user
            )
        });
        const manager = users.filter((user) => {
            return user.role.name == 'manager';
        });
        const admin = users.filter((user) => {
            return user.role.name == 'admin';
        });
        const developer = users.filter((user) => {
            return user.role.name == 'developer';
        });
        const tester = users.filter((user) => {
            return user.role.name == 'tester';
        });
        const client = users.filter((user) => {
            return user.role.name == 'client';
        });
		res.json({
			meta: {
                status: 'success',
                count: allUsers.count,
                count_Role_Manager: manager.length,
                count_Role_Admin: admin.length,
                count_Role_Developer: developer.length,
                count_Role_Tester: tester.length,
                count_Role_Client: client.length,
                totalPages: totalPages,
                previousPage: page > 1 ? `http://localhost:3030/api/users/list?page=${page - 1}` : null,
                currentPage: `http://localhost:3030/api/users/list?page=${page}`,
                nextPage: page < totalPages ? `http://localhost:3030/api/users/list?page=${page + 1}` : null
            },
            data: {
                users
            }
        });
    },

    // URL: http://localhost:3030/api/users/:id
    // Renderiza la vista Detalle de Usuarios
    detail: async (req, res) => {     
        const user = await db.User.findByPk(req.params.id, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'image']
        });
        user.dataValues.urlImage = `http://localhost:3030/img/users/${user.image}`
        user.dataValues.urlDetail = `http://localhost:3030/api/users/${req.params.id}`
        res.json(user);
    },

    // URL: http://localhost:3030/api/users/validUsers
    // Renderiza la vista Detalle de Usuarios válidos
    validUsers: async (req, res) => { 
        const allUsers = await db.User.findAll({
            attributes: ['id', 'first_name', 'last_name', 'email', 'image']
        });
        const users = allUsers.map(user => {
            return (
                user.dataValues.urlImage = `http://localhost:3030/img/users/${user.image}`,
                user.dataValues.urlDetail = `http://localhost:3030/api/users/${user.id}`,
                user
            )
        });
		res.json({
			meta: {
                status: 'success',
                count: users.length
            },
            data: {
                users
            }
        });
    }
};


//----------* EXPORTS CONTROLLER *----------//
module.exports = usersController;