const router = require('express').Router();
const passport = require('passport');
const authMiddelware = require('../utils/authMiddelware');

const {
    homePage,
    loginPage,
    addNewUser,
    LoginErrorHandle,
    LoginSuccessHandle,
    profilePage,
    logout,
    generateInvoice
} = require('../controller/viewController')

router.get('/',  homePage);

router.post('/login', passport.authenticate('local', {failureRedirect:'/error'}), LoginSuccessHandle);

router.get('/error', LoginErrorHandle);
router.get('/login',    loginPage);

router.get('/google-login', passport.authenticate('google', 
{scope:['profile']}
));

router.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect:'/profile',
    failureRedirect:'/login'
}));

router.post('/sign-up', authMiddelware, addNewUser);
router.get('/profile', authMiddelware, profilePage);
router.post('/generate-invoice',authMiddelware, generateInvoice);

router.get('/logout',   logout);


module.exports = router;