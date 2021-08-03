const {createPool} = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const passport = require('passport')


const pool = createPool({
    port : process.env.DB_PORT,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.MYSQL_DB
})


exports.register = (req, res)=>{
    console.log(req.body);
    const {firstName, secondName, gender, email, password, number} = req.body
    pool.query('select email from registration where email = ?', [email], async (error, result)=>{
        if (error){
            console.log(error);
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        
        pool.query('INSERT INTO registration SET ?', {firstName:firstName,secondName:secondName,gender:gender,email:email,password:hashedPassword,number:number},(error, results)=>{
            if (error){
                console.log(error);
            } else {
                console.log(results);
                res.send("Registered user")
            }
        });
    });
}