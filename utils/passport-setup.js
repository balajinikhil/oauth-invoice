const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const GoogleStratergy = require('passport-google-oauth2').Strategy;

const User = require('../model/UserModel');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    try{
        let user = await User.findById(id);
        done(null, user);
    }catch(err){
        done(err);
    }
});

// local auth setup
passport.use(new LocalStratergy(async(username, password, done)=>{
    try{
        const user = await User.findOne({
            username: username
        });

        if(!user) return done(null, false);
        if(!await user.verifyPassword(password, user.password)) return done(null, false);
        return done(null, user);

    }catch(err){
        return done(err);
    }
}));


// google outh2 setup
passport.use(new GoogleStratergy({
    clientID:process.env.GoogleClient,
    clientSecret:process.env.GoogleSecret,
    callbackURL:'/auth/google/redirect'
},
async (req,accessToken, refreshToken, profile, done)=>{
    try{
        let exUser = await User.findOne({googleId: profile.id});
        if (!exUser){
            let user = await User.create({
                username:profile.displayName,
                googleId:profile.id
            });
            return done(null, user)
        }
        else done(null, exUser);

    }catch(err){
        done(err);
    }
}
))