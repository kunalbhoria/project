const express = require('express');
const app = express();
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');


mongoose.connect('mongodb://localhost:27017/smartpos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const User = require('./modules/user')
const Customer = require('./modules/customer')
const Detail = require('./modules/detail')
const Product = require('./modules/product')
const Supplier = require('./modules/supplier')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({secret:"notagoodsecret"}));

const islogin = (req,res,next)=>{
    if(!req.session.user_id){
     return res.redirect('/login');
    }
    next();
}


app.get('/', (req, res) => {
    res.send('Welcome to the Smart POS');
});

app.get('/register',(req,res)=>{
    res.render('register');
});
 
app.post('/register', async(req,res)=>{
    const {email, password} = req.body;
     console.log(req.body)
    let user =await User.findOne({email});
    console.log(user)
    if(user){
    res.send('user already there!')
    }else{
        const hashpassword = await bcrypt.hash(password,11);
        let newUser = new User({email,password:hashpassword});
        await newUser.save(); 
        req.session.user_id = newUser.id;
        res.send(newUser);

    }
})

//login

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    let user = await User.findOne({email});
    console.log(user)
    if(user){
        const isvalid =  await bcrypt.compare(password,user.password);
        if(isvalid){
            req.session.user_id=user.id;
            res.redirect('/home');
        }else{
            res.send("Wrong password or email")
        }
    }else{
        res.send("not a user")
    }
})


//home

app.get('/home',islogin, async (req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    res.render('home',{user})
})

//customer

app.get('/addcustomer',islogin,(req,res)=>{
    res.render('newcustomer')
})

// save customer
app.post('/addcustomer', islogin, async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    let customer = req.body;
    let newcustomer = new Customer(customer);
    newcustomer.admin.push(user);
    await newcustomer.save();
    user.customer.push(newcustomer);
    await user.save();
    res.redirect('/customer')
})

// show customer list
app.get('/customer',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid).populate('customer');
    console.log(user)
    res.send(`${user.customer}`)
})

//product

app.get('/addproduct',islogin,(req,res)=>{
    res.render('newproduct')
})

// save product
app.post('/addproduct', islogin, async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    let product = req.body;
    let newproduct = new Product(product);
    newproduct.admin.push(user);
    await newproduct.save();
    user.product.push(newproduct);
    await user.save();
    res.redirect('/product')
})

// show customer list
app.get('/product',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid).populate('product');
    console.log(user)
    res.send(`${user.product}`)
})


//supplier

app.get('/addsupplier',islogin,(req,res)=>{
  res.render('newsupplier');
});

app.post('/addsupplier',islogin, async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    let supplier = req.body;
    let newsupplier = new Supplier(supplier);
    newsupplier.admin.push(user);
    await newsupplier.save();
    user.supplier.push(newsupplier);
    await user.save();
    res.redirect('/supplier')
});

app.get('/supplier',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid).populate('supplier');
    console.log(user)
    res.send(`${user.supplier}`)
});

app.get('/expenses',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    console.log(user)
    res.send(`${user.expenses}`)
});

app.get('/addexpenses',islogin,async(req,res)=>{
    let link ="addexpenses";
    res.render('adddetails',{link})
});
app.post('/addexpenses',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    await user.expenses.push(req.body);
    await user.save();
    res.redirect('/expenses')
});

app.get('/monthlysales',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    console.log(user)
    res.send(`${user.monthlysales}`)
});

app.get('/addmonthlysales',islogin,async(req,res)=>{
 let link ="addmonthlySales"
    res.render('adddetails',{link})
});
app.post('/addmonthlysales',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    await user.monthlysales.push(req.body);
    await user.save();
    res.redirect('/monthlysales')
});

app.post('/addcartitem',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    await user.cart.push(req.body.cart);
    await user.save();
    res.redirect('/home');
});
app.post('/addpaymentmethod',islogin,async(req,res)=>{
    let userid = req.session.user_id;
    let user = await User.findById(userid);
    await user.paymentmethod.push(req.body.paymentmethod);
    await user.save();
    res.redirect('/home');
})
app.listen('3333', () => {
    console.log('connected to port 3333')
});


