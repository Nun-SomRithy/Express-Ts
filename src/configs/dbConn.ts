import  mongoose from "mongoose"; // Import the route
import  env from "../utills/validateEnv"


const connectDB = async () => {
    try {
       await mongoose.connect(env.MONGOOSE_URL);
        console.log("MongoDB is connected");
    } catch (error) {
        console.error("Error: ", error);
    }
}

export default connectDB;