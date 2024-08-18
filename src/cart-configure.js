const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb://localhost:27017/project-tut');

connect.then(()=>{
    console.log('connect')
})
.catch(()=>{
    console.log('not connect')
})

const CartSchema = new mongoose.Schema({
    product:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    discountPercentage:{
        type: Number,
        required: true
    },
    Color: {
        type: String,
         required: true
   },
    imagePath:{
        type: String,
        
    },
    quantity: {
        type: Number,
        default: 1
    },
    user_id: mongoose.Schema.Types.ObjectId,
    product:  mongoose.Schema.Types.ObjectId,
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
