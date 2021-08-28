import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose' 
import userRouter from './Routers/userRouter.js'
import {createServer} from 'http'
import  * as io from 'socket.io'
import jwt from 'express-jwt'

const app = express();
app.use(express.json());
app.use(cors());



  
  // enforce on all endpoints
  app.use( jwt({
    secret: 'DD06Ti64J81aQjqXinfjVOPrehZFb8dJ',
    audience: 'https://server-112.herokuapp.com',
    issuer: 'https://dev-v--pixya.us.auth0.com/',
    algorithms: ['HS256'] 
  }));

const port = process.env.PORT || 5000;
const server = createServer(app)
server.listen(port, () => console.log(`Server is running at ${port}........`))
app.get("/",(req,res) => res.send("Hurray! server is running..."))
app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});


// Step - 2: Now connect with MongoDB

const url = "mongodb+srv://hemant2747:Ram123456@cluster0.r5go2.mongodb.net/DATABASE?retryWrites=true&w=majority";
mongoose.connect(url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


// Step - 3: Now create models in Model folder

// Step -4: Now create routes (In routers folder and use here)

app.use("/users", userRouter);


// Step - 5: Now implement socket.io [Check userRouter]


const socketIo = new io.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});;

// socketIo.on('connection', (socket) => {
//     console.log('Socket IO is connected.....');
// });


const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log("MongoDB databse connected.");

    const changeStream = connection.collection('users').watch({ fullDocument: 'updateLookup' });

    changeStream.on('change', (change)=>{
        switch(change.operationType){
            case 'insert':
                const user = {
                    _id: change.fullDocument._id,
                    name: change.fullDocument.name,
                    dateAdded: change.fullDocument.dateAdded,
                    desc: change.fullDocument.desc,
                    phone: change.fullDocument.phone
                }
                socketIo.emit('user-added', user)
                break;
            
            case 'delete':
                socketIo.emit('user-deleted', change.documentKey._id)
                break;

            case 'update':
                const updatedUser = {
                    _id: change.fullDocument._id,
                    name: change.fullDocument.name,
                    dateAdded: change.fullDocument.dateAdded,
                    desc: change.fullDocument.desc,
                    phone: change.fullDocument.phone
                }
                socketIo.emit('user-updated',updatedUser)
                break;
        }
    })

})



