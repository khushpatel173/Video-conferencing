import express from 'express'
import cors from 'cors'
import User from './models/User.js';
import bcrypt from 'bcrypt'
import mongoose, { mongo } from 'mongoose';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import http from 'http';
const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true 
}));
app.use(cookieParser());
const PORT = 8080;


const main = async()=>{
    try {
       await mongoose.connect('mongodb://localhost:27017/zoom-user');
   console.log("DB connected"); 
    } catch (error) {
        console.log("error in connecting db");    
    }
}
main()


// app.listen(PORT , ()=>{
//     console.log("Listening to the port" , PORT);    
// });

app.get("/" , (req , res)=>{
   res.send("hey there");
})

app.post("/signup" , async(req , res)=>{
    try {
         const {username , email , password} = req.body;
    const hashedPass = await bcrypt.hash(password , 10);
    const user = new User(
        {
            username , email , password : hashedPass
        }
    );
    const newUser = await user.save();
         const token = jwt.sign({
        userId : user._id
    } , "secret" , {expiresIn: "1d"});

      res.cookie("token" , token , {
            httpOnly : true
        });
    res.json({user : newUser});
    } catch (error) {
        res.json({error : "Error in signing up"});
    }
})

app.post("/login" , async(req ,res)=>{
    try {
         const {username , password} = req.body;
    const user = await User.findOne({username : username});
    if(!user){
        return res.status(401).json({message : "Incorrect Username"});
    }
    const isMatch = await bcrypt.compare(password , user.password);
    
    if(!isMatch){
      return res.status(401).json({message : "Incorrect password"});
    }
    const token = jwt.sign({
        userId : user._id
    } , "secret" , {expiresIn: "1d"});

      res.cookie("token" , token , {
            httpOnly : true
        });
     res.json({
    user: user
});
    } catch (error) {
        res.status(500).json({message : "Error in loggin in"});
    }
   
})

app.get("/profile" , async(req ,res)=>{
    try {
       const token = req.cookies.token;
   if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }
         const decoded = jwt.verify(
            token,
            "secret"
        );
        const user = await User.findById(decoded.userId);
          if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
         res.json({
            user
        });
 
    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
    }

})

app.post("/logout" , (req ,res)=>{
    res.clearCookie("token" , {
        httpOnly : true
    })
     res.json({
        message: "Logged out successfully"
    });
})

app.get("/generateId" ,(req ,res)=>{
    // generate a id and send in the response

    const roomId = nanoid(6);
    res.json({roomId : roomId});
})

const rooms = {};
const server = http.createServer(app);

const io = new Server(server , {cors : {
    origin : "http://localhost:5173"
}})


io.on("connection", socket => {

    console.log(socket.id);
    socket.on(
    "join-room",
    ({ roomId , name }) => {
if (!rooms[roomId]) {
        rooms[roomId] = [];
    }

    const existingUsers = [...rooms[roomId]];

    socket.emit(
        "existing-users",
        existingUsers
    );

    rooms[roomId].push({
        userId: socket.id,
        name
    });
        socket.join(roomId);
        socket.data.name = name;
        socket.data.roomId = roomId;
        socket.to(roomId).emit("user-joined" , {
            userId : socket.id , 
            name : name
        })
    }
);

socket.on("leave-room" , ()=>{
    const roomId = socket.data.roomId;
    if(!roomId) return;
    rooms[roomId] = rooms[roomId].filter(user => user.userId !== socket.id);
    if (
    rooms[roomId] &&
    rooms[roomId].length === 0
) {
    delete rooms[roomId];
}
    socket.to(roomId).emit(
    "user-left",
    {
        userId: socket.id
    }
);
})


socket.on("offer" , ({target , offer})=>{
    io.to(target).emit("offer" , {
        sender : socket.id , offer
    })
})

    socket.on("answer" , ({target , answer})=>{
        io.to(target).emit("answer" , {
            sender : socket.id , 
            answer
        })
    })
            socket.on(
            "ice-candidate",
            ({
                target,
                candidate
            }) => {

                io.to(target).emit(
                    "ice-candidate",
                    {
                        sender:
                            socket.id,
                        candidate
                    }
                );

            }
        );
});


app.get("/check/:id" , (req ,res)=>{
    const {id} = req.params;
    // check if this id is in rooms or not
    if(rooms[id]){
        res.status(200).json({message : "Room exist with this id"});
    }
    else{
        res.status(401).json({message : "Room does exist with this id"});
    }
})
server.listen(8080);