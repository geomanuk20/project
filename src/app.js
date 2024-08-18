require('dotenv').config()  // env
const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const multer = require('multer');
const session = require('express-session')
const bodyParser = require('body-parser');
const collection = require('./configure')
const Address = require('./address-configure')
const Product = require('./configure_product');
const Cart = require('./cart-configure');
const Favourite = require('./favourite')
const { title } = require('process')
const { name } = require('ejs');


const app = express()

const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 3011;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// routes prefix
app.use('',require('../routes/routes'))
app.use('',require('../routes/product'))
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/public", express.static('public'));
app.use("/uploads", express.static('uploads'));

app.use(
    session({
        secret: SECRET,
        saveUninitialized: true,
        resave:false,
        cookie: { secure: false },
    })
)
app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next()
})
// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.authenticated) {
      return next();
    } else {
      res.redirect('/login');
    }
  };


// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
    if (req.session && req.session.authenticated) {
      return next();
    } else {
      res.redirect('/');
    }
  };

// Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/', authenticateUser, (req, res) => {
    res.render('/');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

app.get('/adminhome', (req, res) => {
    res.render('adminhome');
});

app.get('/admin_product', async (req, res) => {
  try {
      const products = await Product.find();
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin_product', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-mobile', async (req, res) => {
  try {
      const products = await Product.find({ category: 'mobile' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-mobile', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-watch', async (req, res) => {
  try {
      const products = await Product.find({ category: 'watch' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-watch', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-earphone', async (req, res) => {
  try {
      const products = await Product.find({ category: 'earPhone' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-earphone', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-speaker', async (req, res) => {
  try {
      const products = await Product.find({ category: 'speaker' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-speaker', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-charger', async (req, res) => {
  try {
      const products = await Product.find({ category: 'charger' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-charger', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-storagedevice', async (req, res) => {
  try {
      const products = await Product.find({ category: 'storagedevice' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-storagedevice', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-powerbank', async (req, res) => {
  try {
      const products = await Product.find({ category: 'powerbank' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-powerbank', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-smartpoint', async (req, res) => {
  try {
      const products = await Product.find({ category: 'smartpoint' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-smartpoint', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-cart', async (req, res) => {
  try {
      const carts = await Cart.find();
      res.render('admin-cart', { title: 'Admin Cart', carts: carts });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});

app.get('/admin-favourite', async (req, res) => {
  try {
      const favourite = await Favourite.find();
      res.render('admin-favourite', { title: 'Admin Cart', favourite: favourite });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});

// signup

app.post('/signup', async(req,res)=>{
    const data = {
        Name:req.body.Name,
        phone:req.body.phone,
        email:req.body.email,
        password:req.body.password,
        repassword:req.body.repassword,
    }
    //user allready exist
    if(data.password !== data.repassword){
        res.send('Passwords do not match. Please try again.');
        //res.status(400).json({ error: 'Passwords do not match. Please try again.' });
    }else{
    const existinguser = await collection.findOne({email: data.email})
    if(existinguser){
        res.send('user already exist')
        //res.status(400).json({ error: 'User already exists' });
    }else{
        //hash the password using bcrypt
        const salt = 10;
        const hashpassword = await bcrypt.hash(data.password,salt)

        data.password = hashpassword;

        const userdata = await collection.insertMany(data)
        console.log(userdata)
        res.render('message', { message: 'User register successfully.', type: 'success'});
        //res.send('<script>alert("User registered successfully"); window.location="/login";</script>');
        //const successMessage = 'User registered successfully';
        //const successMessage = 'Your success message here';
        //res.render('signup', { successMessage });
    }
 }
})

//login user

app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ email: req.body.email });
        if (!check) {
            res.status(404).send('Username not found');
            return;
        }

        const passwordmatch = await bcrypt.compare(req.body.password, check.password);
        if (passwordmatch) {
           req.session.user = { Name: check.Name,phone:check.phone,email:check.email,_id:check._id };
            res.redirect('/home');
        } else {
            res.status(401).send('Wrong password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/home', async (req, res) => {
  if (!req.session.user) {
      res.redirect('/login');
      return;
  }
  const user = req.session.user;
  
  try {
      const products = await Product.find();
      res.render('home', {
          title: 'SHOPY MALL',
          Name: user.Name,
          products: products,
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});
app.get('/user-profile', (req, res) => {
    const user = req.session.user;
    res.render('user-profile',{
        title:'profile',
        Name:user.Name,
    });
});
app.get('/user-personal-information',(req,res)=>{
    const user = req.session.user;
    res.render('user-personal-information',{
        title : 'Account',
        Name:user.Name,
        phone:user.phone,
        email:user.email,
        id:user._id,
    })
})

// GET route to render the user edit page
app.get('/user-personal-edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await collection.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }
        
        res.render('user-personal-edit', {
            title: 'User Edit',
            user: user,
            Name:user.Name,
            phone:user.phone,
            email:user.email,
            id:user._id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
});

app.post('/user-personal-edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await collection.findByIdAndUpdate(
            id,
            {
                Name: req.body.Name,
                phone: req.body.phone,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        req.session.user = updatedUser;
        res.redirect('/user-personal-information');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});

// address
app.get('/address', (req, res) => {
    const user = req.session.user;
    res.render('address',{
        title:'address',
        Name:user.Name,
    });
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads') // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) // Define how uploaded files should be named
    }
  });
  
  var upload = multer({ storage: storage }).single('fileFieldName'); // Specify the field name used for file uploads

app.get('/user-address',upload, async (req, res) => {
    try {
        const newaddress = await Address.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model

        // Render the EJS template and pass the newaddress variable
        res.render('user-address', { newaddress: newaddress });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user address');
    }
});

app.post('/user-address', upload, async (req, res) => {
    try {
      const userAddresses = await Address.find({ user_id: req.session.user._id });
      if (userAddresses.length >= 2) {
        return res.status(400).send('You can only add up to two addresses');
      }
  
      const newAddress = new Address({
        user_id: req.session.user._id,
        fullname: req.body.fullname,
        address: req.body.address,
        phonenumber: req.body.phonenumber,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        homework: req.body.homework,
        alternatenumber: req.body.alternatenumber
      });
  
      const savedAddress = await newAddress.save();
      console.log('Address added to the database:', savedAddress);
      req.session.address = savedAddress;
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving address');
    }
  });

app.get('/address-details', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/login');
            return;
        }

        const user = req.session.user;
        const address = await Address.find({ user_id: user._id });

        res.render('address-details', {
            title: "Address Details",
            Name: user.Name,
            addresses: address, // Pass the addresses array to the template
            id:address._id,   
            fullname: address.fullname,
            address:address.address,
             phonenumber:address.phonenumber,
             city:address.city,
             state:address.state,
             zip:address.zip,
             alternatenumber:address.alternatenumber,
             homework:address.homework,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching address details');
    }
});
// Route to display the edit form
app.get('/edited/:id', async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      if (!address) {
        return res.status(404).send('Address not found');
      }
      const user = req.session.user;
      res.render('edit-address', {title:"edit address", Name:user.Name, address: address });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching address for editing');
    }
  });
  
  // Route to handle the update form submission
  app.post('/edited/:id', upload, async (req, res) => {
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        {
          fullname: req.body.fullname,
          address: req.body.address,
          phonenumber: req.body.phonenumber,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          homework: req.body.homework,
          alternatenumber: req.body.alternatenumber
        },
        { new: true }
      );
      if (!updatedAddress) {
        return res.status(404).send('Address not found');
      }
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating address');
    }
  });
// Assume you have a delete route
app.get('/deleted/:id', async (req, res) => {
    try {
      await Address.findByIdAndDelete(req.params.id);
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting address');
    }
  });
//cart

// GET route to display the cart
app.get('/cart', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const carts = await Cart.find({ user_id: req.session.user._id });
    const products = await Product.find();

    res.render('cart', { 
      title: 'Cart', 
      carts: carts,
      products: products,
      Name: req.session.user.Name
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});

// POST route to add an item to the cart
app.post('/cart', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const carts = await Cart.find({ user_id: req.session.user._id });
    if (carts.length >= 5) {
      return res.status(400).send('You can only add up to two items to cart');
    }

    const newCartItem = new Cart({
      user_id: req.session.user._id,
      product: req.body.product,
      model: req.body.model,
      price: req.body.price,
      Color:req.body.Color,
      discountPercentage: req.body.discountPercentage,
      imagePath: req.body.imagePath
    });

    const savedCartItem = await newCartItem.save();
    console.log('Item added to the cart:', savedCartItem);

    req.session.cart = savedCartItem;

    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).send('Error adding item to cart');
  }
});

// Route to delete a cart item by ID
app.get('/deleted-cart/:id', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/cart');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});
app.get('/remove-cartall', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Favourite.deleteMany(req.params.id);
    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});

// // Route to admindelete a cart item by ID
app.get('/deleted-admin-cart/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/admin-cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting address');
  }
});

app.post('/cart/update', async (req, res) => {
  try {
      const { product, quantity } = req.body;

      // Find the cart item by ID
      let cartItem = await Cart.findById(product);

      // If the item is not found, handle it (optional)
      if (!cartItem) {
          return res.status(404).send('Cart item not found');
      }

      // Update the quantity
      cartItem.quantity += parseInt(quantity, 10);

      // Ensure the quantity doesn't drop below 1
      if (cartItem.quantity < 1) {
          cartItem.quantity = 1;
      }

      // Save the updated cart item
      await cartItem.save();

      // Redirect back to the cart page after updating
      res.redirect('/cart');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

//favorite

app.get('/wishlist', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const favourite = await Favourite.find({ user_id: req.session.user._id });
    const products = await Product.find();

    res.render('wishlist', { 
      title: 'Cart', 
      favourite: favourite,
      products: products,
      Name: req.session.user.Name
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});

// POST route to add an item to the cart
app.post('/wishlist', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const favouriteCount = await Favourite.countDocuments({ user_id: req.session.user._id });
    if (favouriteCount >= 5) {
      return res.status(400).send('You can only add up to five items to the favorites');
    }

    // Check if the item is already in the favorites
    const existingItem = await Favourite.findOne({ 
      user_id: req.session.user._id,
      product: req.body.product 
    });
    if (existingItem) {
      await Favourite.deleteOne({ _id: existingItem._id });
      return res.status(200).send('Item removed from the favorites');
    }

    const newFavoriteItem = new Favourite({
      user_id: req.session.user._id,
      product: req.body.product,
      model: req.body.model,
      price: req.body.price,
      Color: req.body.Color,
      discountPercentage: req.body.discountPercentage,
      imagePath: req.body.imagePath
    });

    const savedFavoriteItem = await newFavoriteItem.save();
    console.log('Item added to the favorites:', savedFavoriteItem);

    res.status(200).send('Item added to the favorites');
  } catch (err) {
    console.error('Error adding item to favorites:', err);
    res.status(500).send('Error adding item to favorites');
  }
});

// Route to delete a cart item by ID
app.get('/deleted-favourite/:id', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Favourite.findByIdAndDelete(req.params.id);
    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});
// // Route to admindelete a cart item by ID
app.get('/deleted-admin-favourite/:id', async (req, res) => {
  try {
    await Favourite.findByIdAndDelete(req.params.id);
    res.redirect('/admin-favourite');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting address');
  }
});

//admin login

app.post('/admin', (req, res) => {
    const { username, password } = req.body;
  
    // Check for a predefined username and password (replace with a more secure method in production)
    if (username === 'admin@gmail.com' && password === '123456') {
      // Set session to mark the user as authenticated
      req.session.authenticated = true;
      res.redirect('/');
    }else {
      res.send('Incorrect username or password. <a href="/admin">Try again</a>');
    }
  });
  
// logout
app.get('/logout',(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/login')
        }
    })
})
app.post('/logout',(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/login')
        }
    })
})

// User mobiles route
app.get('/user-mobiles', async (req, res) => {
  try {
      const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
      const user = req.session.user;
      // Render the EJS template and pass the newaddress variable
      res.render('user-mobiles', {
        title:'mobiles',
         Name:user.Name,
         mobile:products.mobile,
         model:products.model,
         price:products.price,
         brand:products.brand,
         products: products,
        });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user mobiles');
  }
});

const port = PORT;
app.listen(port,()=>{
    console.log(`successfull ${PORT}`)
})






