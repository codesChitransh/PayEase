import mongoose from "mongoose";

const bankSchema=new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
            },
    balance:{
        type:Number,
        required :true
    }
    
})

export const Bank=mongoose.model("Bank",bankSchema);
