//----------* REQUIRE'S *----------//
const bcrypt = require('bcryptjs');
const helper = require('../helpers/helper');


//----------* VARIABLE'S *----------//


//----------* USERS CONTROLLER *----------//
const usersController = {
    // Renderiza la vista Registro
    register: (req, res) => {        
        res.render('users/register');
    },

    // Crea un nuevo Usuario 
    createUser: (req, res) =>{
        const users = helper.getAllUsers();
        const passwordHashed = bcrypt.hashSync(req.body.password, 5);
        const user = {
            id: helper.getNewUserId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName, 
            email: req.body.email,
            password: passwordHashed,
            image: req.files[0].filename
        }
        const usersToSave = [...users,user]
        helper.writeUsers(usersToSave);
        return res.redirect('/usuario/login');
    },

    // Renderiza la vista Login
    login: (req, res) => {        
        res.render('users/login');
    },

    processLogin: (req ,res) => {
        const users = helper.getAllUsers();
        const user = users.find(user => user.id == req.params.id);
		res.redirect('/:id');
    },

    // Renderiza la vista Perfil de usuario
    profile: (req, res) => {
        const users = helper.getAllUsers();
        const user = users.find(user => user.id == req.params.id);
		res.render('users/profile', {
			user: user,
        });
    },

    // Renderiza la vista Edición de Perfil
    editForm: (req, res) => {    
        const users = helper.getAllUsers();
        const user = user.find(user => user.id == req.params.id)    
        return res.render('/users/editUser', {user:user});
    },

    // Edita el perfil de un Usuario
    editProfile: (req, res) => { 
        const users = helper.getAllUsers();
        const editedUser = users.map(function(user){
            if (user.id == req.params.id) {
                user.firstName=req.body.firstName; 
                user.lastName=req.body.lastName;
                user.email =req.body.email;
                user.password=req.body.password;
                user.category=req.body.category;
                user.image=req.files[0].filename;
            } 
            return user
        })
        helper.writeUsers(editedUser);
        res.redirect('usuario/:id'+ req.params.id);       
    },

    // Elimina el perfil de un usuario
    delete: (req, res) => {        
        const users = helper.getAllUsers();
        const remainingUsers = users.filter((user) => {
			return user.id != req.params.id;
        });
        helper.writeUsers(remainingUsers);
        return res.redirect('/usuario/registro');
    }
};

//----------* EXPORTS CONTROLLER *----------//
module.exports = usersController;