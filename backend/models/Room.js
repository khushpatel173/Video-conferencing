import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomId : {
            type : String
        } , 
        host : {
            type : mongoose.Schema.Types.ObjectId
        }
    }
);

const Room = mongoose.model("Room" , roomSchema);
export default Room;