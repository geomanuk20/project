const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb://localhost:27017/project-tut');

connect.then(()=>{
    console.log('connect')
})
.catch(()=>{
    console.log('not connect')
})

const FavouriteSchema = new mongoose.Schema({
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
    imagePath:{
        type: String,
        
    },
    user_id: mongoose.Schema.Types.ObjectId,
    product:  mongoose.Schema.Types.ObjectId,
});

const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;