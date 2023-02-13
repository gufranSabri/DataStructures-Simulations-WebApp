const fs= require('fs');
const express = require('express');
const nodeMailer= require('nodemailer');
const bodyParser= require('body-parser')
const router= express.Router();
const cookieParser= require('cookie-parser');
const session = require('express-session');
const MongoClient= require('mongodb');
const device = require('express-device');
const url ="mongodb+srv://gufran:pleasedontsteal@cluster0.w7ri1.mongodb.net/Users?retryWrites=true&w=majority"
const deleteCode ="delCode|~:"
var verifCode=(Math.floor(1000 + Math.random() * 9000))+"";
var touchDevices=["tablet","phone"];
var problemDevices=["tv","bot","car"];

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 
router.use(session({
    secret:"secret lmao",
    saveUninitialized:true,
    resave:false
}));
router.use(device.capture());
var transporter = nodeMailer.createTransport({service:"gmail",auth:{user:"dslearn.dnr@gmail.com",pass:"wamedoo5"}})
var mailOptions = {from: 'dslearn.dnr@gmail.com',to: '',subject: '',html:''};

router.get('/',(req,res)=>{
    res.redirect("/algorithms");
    return;
    // if(req.session.name){
    //     MongoClient.connect(url,(err,db)=>{
    //         if(err)res.render("error");
    //         var dbo= db.db("Users");
    //         dbo.collection("Accounts").find({name:req.session.name}).toArray((e,r)=>{
    //             if(e)res.render("error");
    //             if(r.length==0)res.render("error");
    //             res.render("home",{name:req.session.name,simC:r[0].simulationsViewedCount,notes:r[0].notes,coins:r[0].coins,surveyed:r[0].surveyed})
    //         })
    //     })
    // }
    // else res.redirect("/account")
})
// router.post('/',(req,res)=>{
//     var info= req.body;
//     MongoClient.connect(url,(err,db)=>{
//         if(err)res.render("error");
//         var dbo= db.db("Users");
//         dbo.collection("Accounts").find({name:info.name}).toArray((e,r)=>{
//             if(e)res.render("error");
//             else if(r.length==0)res.render("error");
//             else if(info.sub){
//                 var newNotes=r[0].notes;
//                 if(info.sub==deleteCode)newNotes=info.bod;
//                 else if(info.sub!=""&&info.bod!="")newNotes=r[0].notes+"|weBeSplittingMainlyLmao|"+info.sub+"|weBeSplittingNotelyLmao|"+info.bod;
//                 dbo.collection("Accounts").updateOne({name:info.name},{$set:{notes:newNotes}}, 
//                     function(err, ress) {
//                         if (err)res.render("error");
//                         else res.render("home",{name:info.name,simC:r[0].simulationsViewedCount,notes:newNotes,coins:r[0].coins,surveyed:r[0].surveyed})
//                 });
//             }
//             else res.render("home",{name:info.name,simC:r[0].simulationsViewedCount,notes:r[0].notes,coins:r[0].coins,surveyed:r[0].surveyed})
//         })
//     })
// })
// router.get('/account',(req,res)=>{
//     req.session.name=undefined;
//     res.render("signIn");
// })
// router.post("/account",(req,res)=>{
//     var info= req.body;
//     MongoClient.connect(url,(err,db)=>{
//         if(err)res.render("error");
//         var dbo= db.db("Users");
//         if(info.verif!=""){
//             var obj={email:info.email,name:info.name,pass:info.pass,simulationsViewedCount:0,notes:"",coins:100,surveyed:0};
//             dbo.collection("VerifCodes").find({email:info.email}).toArray((e,r)=>{
//                 if(e)res.render("error");
//                 else if(r.length==0)res.render("error");
//                 else{
//                     if(r[0].code==info.verif){
//                         dbo.collection("Accounts").insertOne(obj,(err,result)=>{
//                             if(err)res.render("error");
//                             else{
//                                 dbo.collection("VerifCodes").deleteOne({email:info.email}, function(ex, ox) {if (ex) throw err;});
//                                 req.session.name=info.name;
//                                 res.redirect("/");
//                             }
//                         })
//                     }
//                     else res.render("signIn",{authorized:"noVerif",email:info.email,name:info.name,pass:info.pass});
//                 }
//             })
//         }
//         else if(info.email==""){
//             var query={name:info.name};
//             dbo.collection("Accounts").find(query).toArray((err,result)=>{
//                 try{
//                     if(result.length==0)res.render("signIn",{authorized:"noAuth",name:info.name,pass:info.pass});
//                     if(info.pass==result[0].pass){
//                         req.session.name=info.name;
//                         res.redirect("/");
//                     }
//                     else res.render("signIn",{authorized:"noAuth",name:info.name,pass:info.pass});
//                 }
//                 catch(TypeError){res.render("signIn",{authorized:"noAuth",name:info.name,pass:info.pass});}
//                 db.close();
//             })
//         }
//         else{
//             var query1={name:info.name},query2={email:info.email};
//             dbo.collection("Accounts").find(query1).toArray((theError1,theResult1)=>{
//                 if(theError1)res.render("error");
//                 if(theResult1.length==0){
//                     dbo.collection("Accounts").find(query2).toArray((theError2,theResult2)=>{
//                         if(theError2)res.render("error");
//                         if(theResult2.length==0){
//                             verifCode=(Math.floor(1000 + Math.random() * 9000))+"";
//                             mailOptions.to=info.email;
//                             mailOptions.subject="Verification Code : "+verifCode;
//                             mailOptions.html="<h1 style='color:red'>Hi there!</h1><p>Welcome to DSLearn! I hope you have an amazing time learning here. You just have "+
//                                         "one more thing to do. Get your account verified by typing in the verification code below on the website.</p><br><br>"+
//                                         "<b>Verification Code : </b>"+verifCode+"<br><br>Good luck!";
//                             transporter.sendMail(mailOptions, function(error, infot){
//                                 if (error) res.render("signIn",{authorized:"noEm1",email:info.email,name:info.name,pass:info.pass});
//                                 else {
//                                     db.close();
//                                     verifCodesDB(info,res)
//                                 }
//                             });
//                         }
//                         else res.render("signIn",{authorized:"noEm2",email:info.email,name:info.name,pass:info.pass});
//                     })
//                 }
//                 else res.render("signIn",{authorized:"noN",email:info.email,name:info.name,pass:info.pass});
//             })
//         }
//     })
// })
// router.get("/survey",(req,res)=>{
//     if(req.session.name){
//         MongoClient.connect(url,(err,db)=>{
//             if(err)res.render("error");
//             var dbo= db.db("Users");
//             dbo.collection("Accounts").find({name:req.session.name}).toArray((e,r)=>{
//                 if(e)res.render("error");
//                 if(r.length==0)res.render("error");
//                 if(r[0].surveyed==0)res.render("survey");
//                 else res.redirect("/")
//             })
//         })
//     }
//     else res.redirect("/account")
// })
// router.get("/skipsurvey",(req,res)=>{
//     if(!req.session.name)res.redirect("/")
//     else doneSurvey(req,res);
// })
router.get('/learn',(req,res)=>{
    res.redirect("/");
    // res.render("learn");
});
// router.get('/info/:topic',(req,res)=>{res.render("info",{topic:req.params.topic});})
router.get('/code/:topic/:lang',(req,res)=>{
    fs.readFile('./public/CodeFiles/'+req.params.lang+"/"+req.params.topic+".txt",(err,data)=>{
        if(err)res.render("error");
        else{
            res.render('code',{topic: req.params.topic,lang: req.params.lang,code: data.toString().split("|-|-|")[0]})
        }
    });
})
router.get('/algorithms',(req,res)=>{res.render('hub')})
router.get('/linear-simulation/:topic',(req,res)=>{
    fs.readFile("./public/CodeFiles/Java/"+req.params.topic+".txt",(err1,data1)=>{
        if(err1)res.render("error")
        else {
            fs.readFile("./public/CodeFiles/Python/"+req.params.topic+".txt",(err2,data2)=>{
                if(err2)res.render("error");
                else {
                    fs.readFile("./public/CodeFiles/Cpp/"+req.params.topic+".txt",(err3,data3)=>{
                        if(err3)res.render("error");
                        else {
                            fs.readFile("./public/CodeFiles/Cs/"+req.params.topic+".txt",(err4,data4)=>{
                                if(err4)res.render("error");
                                else res.render('linear-simulation',{topic: req.params.topic,j:data1.toString(),p:data2.toString(),cp:data3.toString(),cs:data4.toString()})
                            });
                        }
                    });
                }
            });
        }
    });
})
router.get('/sort/:topic',(req,res)=>{res.render('canvasSims',{topic: req.params.topic});})
router.get('/sim/:topic',(req,res)=>{
    if(touchDevices.includes(req.device.type)||problemDevices.includes(req.device.type))res.render("error");
    else{
        if(req.params.topic=="queue")req.params.topic+="-linked";
        fs.readFile("./public/CodeFiles/Java/"+req.params.topic+".txt",(err1,data1)=>{
            if(err1)res.render("error")
            else {
                fs.readFile("./public/CodeFiles/Python/"+req.params.topic+".txt",(err2,data2)=>{
                    if(err2)res.render("error");
                    else {
                        fs.readFile("./public/CodeFiles/Cpp/"+req.params.topic+".txt",(err3,data3)=>{
                            if(err3)res.render("error");
                            else {
                                fs.readFile("./public/CodeFiles/Cs/"+req.params.topic+".txt",(err4,data4)=>{
                                    if(req.params.topic=="queue-linked")req.params.topic="queue";
                                    if(err4)res.render("error");
                                    else res.render('canvasSims',{topic: req.params.topic,j:data1.toString(),p:data2.toString(),cp:data3.toString(),cs:data4.toString()})
                                });
                            }
                        });
                    }
                });
            }
        });
    }
})
router.get('/towers-of-hanoi',(req,res)=>{
    if(touchDevices.includes(req.device.type)||problemDevices.includes(req.device.type))res.render("error");
    else res.render('toh')
})
router.get('/sim/graph',(req,res)=>{
    if(touchDevices.includes(req.device.type)||problemDevices.includes(req.device.type))res.render("error");
    else res.render('graph')
})
// router.get('/tests',(req,res)=>{res.render('error');})
// router.get('/about',(req,res)=>{res.render('about');})

// function verifCodesDB(info,res){
//     MongoClient.connect(url,(err,dbb)=>{
//         if(err)res.render("error");
//         var dbx= dbb.db("Users");
//         var objCode={email:info.email,code:verifCode};
//         dbx.collection("VerifCodes").find({email:info.email}).toArray((codeE,codeRes)=>{
//             if(codeE)res.render("error");
//             if(codeRes.length==0){
//                 dbx.collection("VerifCodes").insertOne(objCode,(ev,rv)=>{
//                     if(ev)res.render("error");
//                     else res.render("signIn",{authorized:"verif",email:info.email,name:info.name,pass:info.pass});;
//                 })
//             }
//             else{
//                 dbx.collection("VerifCodes").updateOne({email:info.email},{$set:{code:verifCode}}, 
//                 function(err, ress) {
//                     if (err)res.render("error");
//                     else res.render("signIn",{authorized:"verif",email:info.email,name:info.name,pass:info.pass});;
//                 });
//             }
//         })
//     });
// }
// function doneSurvey(req,res){
//     MongoClient.connect(url,(err,db)=>{
//         if(err)res.render("error");
//         var dbo= db.db("Users");
//         dbo.collection("Accounts").updateOne({name:req.session.name},{$set:{surveyed:1}}, 
//             function(err, ress) {
//                 if (err)res.render("error");
//                 else res.redirect("/");
//         });
//     })
// }

module.exports=router;