import mongoose from 'mongoose';


const databaseInit = ()=>{
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((result)=>{
    console.log('connected');
  }).catch((error)=>{
    console.log('error to connect');
  });
};

export default databaseInit;
