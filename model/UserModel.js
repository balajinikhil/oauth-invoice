const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    password:{
        type:String
    },
    googleId:{
        type:String
    }
})

UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

UserSchema.methods.verifyPassword = async function(entry, db){
    return await bcrypt.compare(entry,db);
} 

module.exports = mongoose.model('users', UserSchema);