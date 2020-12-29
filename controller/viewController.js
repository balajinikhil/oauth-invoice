const fs = require('fs');
const path = require('path');
const easyinvoice = require('easyinvoice');

const catchAsync = require('../utils/catchAsync');
const User = require('../model/UserModel');

exports.homePage = catchAsync(async(req,res,next)=>{
    res.status(200).render('home');
});

exports.loginPage = catchAsync(async(req,res,next)=>{
    res.status(200).render('login')
});

exports.addNewUser = catchAsync(async(req,res,next)=>{

    const {
        username,
        password
    } = req.body

    const user = await User.create({
        username:username,
        password:password
    });

    res.status(201).json({
        status:'created',
        user
    })
})

exports.LoginErrorHandle = catchAsync((req,res,next)=>{
    res.status(400).json({
        status:'Fail',
        message:'Check Email Or Password'
    })
});

exports.LoginSuccessHandle = catchAsync(async(req,res,next)=>{
    res.status(200).json({
        status:'success',
        message:'logged in',
        redirect:'/profile'
    })
});

exports.profilePage = catchAsync(async(req,res,next)=>{
    res.status(200).render('profile', {
        user:req.user
    })
});

exports.logout = catchAsync(async(req,res,next)=>{
    req.logout();
    res.redirect('/');
});

exports.generateInvoice = catchAsync(async(req,res,next)=>{
    let {
        sender,
        client,
        invoiceNumber,
        invoiceDate,
        products,
        logo
    } = req.body;

    /*
    {
  sender: { company: 'Balaji Nikhil', address: 'test' },
  client: { company: 'test', address: 'test' },
  invoiceNumber: 'test',
  invoiceDate: '2020-12-31',
  products: [
    { description: 'test', quantity: '1', tax: '1', price: '1' },
    { description: 'test', quantity: '2', tax: '2', price: '2' },
    {}
  ]
}
    */
   let arr = products;
   arr = await arr.map((e)=>{
       if(e.price){
           return {
               "quantity": e.quantity * 1,
               "description": e.description ,
               "tax": e.tax * 1,
               "price": e.price * 1
           }
       }
       else return null
   })

    let data = {
        //"documentTitle": "RECEIPT", //Defaults to INVOICE
    "currency": "INR",
    "taxNotation": "gst", //or gst
    "marginTop": 25,
    "marginRight": 25,
    "marginLeft": 25,
    "marginBottom": 25,
    "logo":logo ? logo : "https://www.easyinvoice.cloud/img/logo.png",
    "sender":{
        "company":sender.company,
        "address":sender.address,
        "zip": sender.zip,
        "city": sender.city,
        "country": sender.country
    },
    "client": {
        "company": client.company,
        "address": client.address,
        "zip": client.zip,
        "city": client.city,
        "country": client.country
 },
    "invoiceNumber": invoiceNumber,
    "invoiceDate": `${invoiceDate}`,
    "products": arr,
    "bottomNotice": "Kindly pay your invoice within 15 days."
    }

    const result = await easyinvoice.createInvoice(data);
    await fs.writeFileSync(path.join(__dirname, "../public/invoice.pdf"), result.pdf, 'base64');

    res.status(200).json({
        status:'success',
        redirect:'/invoice.pdf'
    })
})