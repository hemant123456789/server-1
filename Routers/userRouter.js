import express from 'express'
import User from '../Models/Users.js'
const userRouter = express.Router()
import bcrypt from 'bcryptjs'


export const Encrypt = {

    cryptPassword: (password) =>
        bcrypt.genSalt(10)
        .then((salt => bcrypt.hash(password, salt)))
        .then(hash => hash),
    
        comparePassword: (password, hashPassword) =>
            bcrypt.compare(password, hashPassword)
            .then(resp => resp)
    
    }
userRouter.post(
    '/create',
    async(req,res) => {
        var response={}
        const EncryptPassword = await Encrypt.cryptPassword(req.body.password);
       // const myBoolean = await Encrypt.comparePassword(req.body.password, myEncryptPassword);
        const data = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            password: EncryptPassword,
            credatedDate: new Date().toISOString()
        }

        const user = new User(data);

        try {
            await user.save();
            response.status=200;
            response.data = 'saved succesfully'
        } catch (error) {
            response.status=500;
            response.data = error;
            console.log(error)
        }
        res.send(response);

    }
)


userRouter.put(
    '/update',
    async (req, res) => {
        const data = {
            name: req.body.name,
            dateAdded: req.body.dateAdded,
            desc: req.body.desc,
            phone: req.body.phone,
        }

        const id = req.body._id;

        try {
            await User.findByIdAndUpdate(id,data,(err,updatedData)=>{
                if(!err) res.send(`Updated data`)
                else console.log(err)
            })
        } catch (error) {
            console.log(error)
        }

    }
)


userRouter.delete(
    '/delete/:id',
    async(req,res) => {
        const id = req.params.id;
        await User.findByIdAndRemove(id).exec();
        res.send('Deleted');
    }
)


userRouter.get(
    '/read',
    async (req, res) => {
        User.find({}, (error,result)=>{
            var response={}
            response.header=req.headers;
            if(error){
                response.status=500;
                response.data = error;
            }
            else{
                response.status=200;
                response.data = result;
            }
            res.send(response);
        })
    }
)


export default userRouter