const MONGODB_KEY ="mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net/__CONCOX__";
const mongoose=require('mongoose');
mongoose.connect(MONGODB_KEY, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Connected to MongoDB'))

require('dotenv').config();
const express=require('express');
const router = express.Router();

const NodeGeocoder = require('node-geocoder');

const options={
    provider: 'google',
    fetch:"",
    apiKey: process.env['GOOGLE_KEY'],
    formatter: null
};

const geocoder = NodeGeocoder(options);

const findLocation = (devices, statusCollection) => {
    devices.forEach(async (device) => {
        const statuses = await statusCollection
        .find({id: device })
        .toArray()
    })
}

router.post('/:collect1', async(req, res) => {
    const url = "mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net/__CONCOX__"
    const collection1 = req.params.collect1
    const collection2 = req.query.collect2
    console.log(url, collection1, collection2)

    let devices = []

    try {
        const devicesCollection = db.collection(collection1)
        const data = await devicesCollection
        .find()
        .sort({ createdAt: -1})
        .limit(30)
        .toArray()
        data.forEach((device) => {
            devices.push(device.id)
        })
        const statusCollection = await db.collection(collection2)
        findLocation(devices, statusCollection)

        res.send({
            "name": "Ravneet Kaur",
            "contact": "ravneetkaur9978@gmail.com",
            "deviceID": devices,
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/',(req,res)=>{
    const addresses=req.body.address
    let finalAddress=[]
    addresses.forEach(async (address) => {
    try{
        addresses.forEach( async (address)=>{
        const ans=await geocoder.geocode(address)
        const lat=ans[0].latitude;
        const long=ans[0].longitude;
        const output={add:address,location:[lat,long]}
        console.log(output);
        finalAddress.push(output);
       })
    }
    catch(err){
        res.status(500).json({message:"Unsuccessful"});
    }
    })
    res.end('Successful POST Request');
})

module.exports=router;