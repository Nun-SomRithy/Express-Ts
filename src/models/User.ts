import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
    roles: [{
        type: String,
        required: true,
        default: "Employee"
    }],
    active: {
        type: Boolean, required: true, default: true
    }
})

export default mongoose.model("User", userSchema);