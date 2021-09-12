import mongoose from 'mongoose'


// Now create a Schema


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    credatedDate: {
        type: String,
        required: true
    }
})



// Now create a model

const User = mongoose.model("users", UserSchema);

export default User