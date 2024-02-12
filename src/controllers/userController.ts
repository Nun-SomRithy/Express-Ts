import User from '../models/User';
import Note from '../models/Note';
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

export const getAllUsers = expressAsyncHandler(async (req:any, res:any) => {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
        return  res.status(404).json({message: "No user found"})
    }
    res.json(users);
});

export const createNewUser = expressAsyncHandler(async (req:any, res:any) => {
    const {username, password, roles} = req.body;
    //confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length ) {
        return res.status(400).json({message: "Invalid data"})
    }
    const duplicateUser = await User.findOne({username: username}).lean().exec();
    if (duplicateUser) {
        return res.status(400).json({message: "User already exist"})
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {username, "password": hashedPassword, roles};

    const newUser = await User.create(userObj);

    if (newUser){
        return res.status(201).json({message:`User ${username}  created successfully`});
    }else{
        return res.status(500).json({message: "User not created"});
    }

});

export const updateUser = expressAsyncHandler(async (req:any, res:any) => {
    const {id , username,roles,active,password} = req.body;

    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: "All fields are required"})
    }
    const user:any = await User.findById(id).exec();
    if (!user){
        return res.status(400).json({message: "User not found"});
    }

//     duplicate username
    const duplicateUser = await User.findOne({username}).lean().exec();
//    if user is not the same user
    if(duplicateUser && duplicateUser?._id.toString() !== id){
        return res.status(409).json({message: "Username already exist"});
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password){
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save();
    res.status(200).json({message: "User updated successfully", updatedUser});
});

export const deleteUser = expressAsyncHandler(async (req:any, res:any) => {
  const {id} = req.body;
    if (!id) {
        return res.status(400).json({message: "User id is required"})
    }
    // delete  : delete user notes
    const notes = await Note.findOne({user: id}).lean().exec();
    if (notes){
        return  res.status(400).json({message: "User has notes, delete notes first"})
    }
    const user:any = await User.findById(id).exec();
    if (!user){
        return res.status(404).json({message: "User not found"})
    }
    const result = await user.deleteOne();
    const reply = `Username ${result.user} deleted successfully`;
    res.json({message: reply});

});

export default {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}