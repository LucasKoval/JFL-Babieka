//----------* REQUIRE'S *----------//
const helper = require('../helpers/helper');
const db = require('../db/models');


//----------* VARIABLE'S *----------//
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


//----------* PRODUCTS CONTROLLER *----------//
const productsController = {
    // Renderiza la vista Colección
    list: (req, res) => {
        const products = helper.getAllProducts();
		const fiesta = products.filter((product) => {
			return product.category == 'Fiesta';
		});
		const casual = products.filter((product) => {
			return product.category == 'Casual';
        });
		res.render('products/productsList', {
			fiestaProducts: fiesta,
			casualProducts: casual
		});        
    },

    // Renderiza la vista Sale
    sale: (req, res) => {        
        const products = helper.getAllProducts();
        const sale = products.filter((product) => {
			return product.category == 'Sale';
		});
		res.render('products/productsSale', {
			saleProducts: sale
		});  
    },

    // Renderiza la vista Listado Completo
    productsFullList: (req, res) => {
        const products = helper.getAllProducts();
		const fiesta = products.filter((product) => {
			return product.category == 'Fiesta';
		});
		const casual = products.filter((product) => {
			return product.category == 'Casual';
        });
        const sale = products.filter((product) => {
			return product.category == 'Sale';
		});
		res.render('products/productsFullList', {
			fiestaProducts: fiesta,
            casualProducts: casual,
            saleProducts: sale
		});        
    },

    // Renderiza la vista Detalle de producto
    detail: async (req, res) => {   
        const product = await db.Product.findByPk(req.params.id, {
            include: ["category", "color", "description", "discount","image", "model", "size", "type"]
        });
        res.render('products/productDetail', { product : product });
           
    },

    // Agrega un articulo al Carrito
    addToCart: (req, res) => {
        const products = helper.getAllProducts();
        const cartProducts = helper.getCartProducts();
        const productToAdd = products.find(products => products.id == req.params.id);
        const productsToCart = [...cartProducts, productToAdd];
        helper.writeToCart(productsToCart);
        return res.redirect('/producto/carrito');
    },

    // Renderiza la vista Carrito
    cart: (req, res) => {     
        const products = helper.getCartProducts();
		res.render('products/productCart', {
			cartProducts: products,
		}); 
    },

    // Renderiza la vista Nuevo artículo
    createForm: (req, res) => {        
        res.render('products/createProduct');
    },
    
    // Crea un artículo (POST)
    
    store: async (req, res) => {// poner todo en sus tablas correspondientes y relacionarlo con la tabla de Product
            
            const createDescrioption = await db.Description.create({text: req.body.description})
            const createImage = await db.Image.create({name: req.files[0].filename})
            const createModel = await db.Model.create({name: req.body.name})
            
            await db.Product.create({
                model_id: createModel.id /*|| req.body.selectName*/, 
                price: req.body.price,
                discount_id: req.body.discount,
                stock: req.body.stock,
                color_id: req.body.color,
                size_id: req.body.size,
                category_id: req.body.category,
                type_id: req.body.type,
                description_id:createDescrioption.id,
                image_id: createImage.id
            },
            {include:["category", "color", "description", "discount","image", "model", "size", "type"]}
            )
        
            return res.redirect('/producto/listado');
        },

    // Renderiza la vista Edición de artículo
    editForm: (req, res) => { 
        const products = helper.getAllProducts();
        const product = products.find(product => product.id == req.params.id);     
        res.render('products/editProduct', { product : product });       
    },

    // Edita un artículo (PUT)
    edit: (req, res) => {        
        const products = helper.getAllProducts();
        const editedProduct = products.map(function(product){
            if (product.id == req.params.id) {
                product.name=req.body.name; 
                product.type=req.body.type;
                product.category =req.body.category;
                product.size=req.body.size;
                product.color=req.body.color;
                product.description=req.body.description;
                product.image = req.files[0] ?  req.files[0].filename : product.image;
                product.price=req.body.price;
            } 
            return product
        })
        helper.writeProducts(editedProduct);
        res.redirect('/producto/'+ req.params.id);
    },

    //Elimina un artículo (DELETE)
    delete: (req, res) => {        
        const products = helper.getAllProducts();
        const remainingProducts = products.filter((product) => {
			return product.id != req.params.id;
        });
        helper.writeProducts(remainingProducts);
        return res.redirect('/producto/listado');
    }
};


//----------* EXPORTS CONTROLLER *----------//
module.exports = productsController;