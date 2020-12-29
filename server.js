process.on('uncaughtException', (err)=>{
    console.error(err);
    process.exit(3);
});

const dotenv = require('dotenv');
dotenv.config({
    path:'./config.env'
});

console.log(process.env.DB);

const mongoose = require('mongoose');
const DB = process.env.DB;

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true  
}).then(()=>console.log(`DB connected`));

const app = require('./app');
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, ()=>{
    console.log(`server up and running ${PORT}`);
} )


process.on('unhandledRejection', (err)=>{
    console.error(err);
    server.close(()=>{
        process.exit(3);
    })
}) 