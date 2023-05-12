const express=require('express');
const cookieParser = require("cookie-parser");
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const connection=mysql.createConnection({
    host:"server2.bsthun.com",
    port:"6105",
    user:"lab_1ljbcl",
    password:"ms9uPTcGiA3Hgx2h",
    database:"lab_todo02_1l5didf"
});
// Export connection to use in other files
global.connection = connection;
// Connect to database
connection.connect();
const port=3001;
const app=express();

app.use(bodyParser.json({type:"application/json"}));
app.use(cookieParser());


// Register endpoints
app.post("/login", require("./endpoint_login"));
app.post("/register", require("./endpoint_register"));
app.get("/check", require("./endpoint_check_login"));
app.get("/todo/all", require("./endpoint_get_all_todos"));


// app.get("/",(req,res)=>{
//     res.send("Hello World!")
// });
// app.post("/basic/login",(req,res)=>{
//     const username=req.body.username;
//     const password=req.body.password;
//     var sql=mysql.format(
//         'SELECT * FROM users WHERE username=? AND password=?',[username,password]
//     );
//     console.log("DEBUG: /basic/login =>" +sql);
// connection.query(sql,(err,rows)=>{
//     if(err){
//         return res.json({
//             success: false,
//             data: null,
//             error: err.message,
//         }); 
//     }
//     else{
//         numRows=rows.length;
//         if(numRows==0){
//             res.json({
//                 success: false,
//                 message: "Login credential is incorrect"
//             });
//         }
//         else{
//             res.json({
//                 success:true,
//                 message:"Login credential is correct",
//                 user:rows[0],
//             });
//         }
//     }
// });
// });
// const passwordTest1="12345679";
// const passwordTest2="asdf12123";

// const hashExample= async()=>{
//     const salt1= await bcrypt.genSalt(10);
//     console.log("Salt #1: ",salt1 );
//     const hash1=await bcrypt.hash(passwordTest1,salt1);
//     console.log("Hash #1: ",hash1);

//     const salt2 = await bcrypt.genSalt(10);
// 	console.log("Salt #2: ", salt2);
//     const hash2=await bcrypt.hash(passwordTest2,salt2);
//     console.log("Hash #2: ",hash2);

//     const valid1=await bcrypt.compare(passwordTest1,hash1);
//     console.log("Validation #1: ",valid1);

//     const valid2=await bcrypt.compare(passwordTest1,"$2b$10$fwkjdMXyeLb7DGaU2UKwTecPJfC7i3ktBP5pFwC3ov71dMSsehus3");

//     console.log("Validation #2: ",valid2);

//     const valid3=await bcrypt.compare(passwordTest2,hash2);

//     console.log("Validation #3: ",valid3);
// };
// hashExample();

// //Assignment 1
// app.post("/login",(req,res)=>{
//     const username=req.body.username;
//     const password=req.body.password;

//     var sql=mysql.format(
//         `select * from users where username=?`,[username]
//     );
//     console.log("debug: /login => " +sql );
//     connection.query(sql,async(err,rows)=>{
//         if(err){
//             return res.json({
//                 success: false,
//                 data:null,
//                 error:err.message,
//             });
//         }
//         else{
//             numRows=rows.length;
//             if(numRows==0){
//                 res.json({
//                     success:false,
//                     message:"User not found",
//                 });
//             }
//             else{
//                 const match=await bcrypt.compare(password,rows[0].hashed_password);
//                 if(match){
//                     res.json({
//                         success:true,
//                         message:'User Authentication is a success',
//                         user:rows[0],
//                     })
//                 }
//                 else{
//                     res.json({
//                         success:true,
//                         message:'Incorrect Password',
//                     })
//                 }
//             }
//         }
//     })
// })

// //Assignment 2
// app.post("/register",(req,res)=>{
//     const username=req.body.username;
//     const password=req.body.password;

//     //password validation
//     if(password.length<8 || !/[A-Z]/.test(password)|| !/[a-z]/.test(password)|| !/\d/.test(password)){
//         return res.json({
//             success:false,
//             message:"Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.",
//         });
//     }
//     else{
//         bcrypt.genSalt(10,(err,salt) => {
//             bcrypt.hash(password,salt,(err,hashPassword)=> {
//                 if(err){
//                     return res.json({
//                         success: false,
//                         data: null,
//                         error: err.message,
//                     })
//                 }
//                 else{
//                     //insert into sql
//         var sql=mysql.format(
//             `Insert into users (username,password,hashed_password) values (?,?,?)`,[username,password,hashPassword]
//         )
//         console.log("DEBUG: /basic/login =>" +sql);
//         connection.query(sql,(err,rows)=>{
//             if(err){
//                 return res.json({
//                     success: false,
//                     data: null,
//                     error: err.message,
//                 })
//             }
//             else{
//                 if(rows){
//                     res.json({
//                         success:true,
//                         data:{
//                             message: "Registeration Success."
//                         }
//                     })
//                 }
//             }
//         })
//                 }
//             })
//         })
        

//     }
// })


app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
});                                              