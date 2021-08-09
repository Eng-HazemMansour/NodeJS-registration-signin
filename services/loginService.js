const {createPool} = require("mysql");
const bcrypt = require("bcrypt");

const pool = createPool({
    port : process.env.DB_PORT,
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.MYSQL_DB
})


let findUserByEmail = (email) => {
    return new Promise(((resolve, reject)=>{
        try{
        pool.query(`select * from registration where email = ?`, [email], function(error, rows){
            if (error){
                reject(error);
            }
            let user = rows[0];
            resolve(user)
        })
    } catch(e){
        reject(e);
    }
    }))
};

let comparePasswordUser = (user, password) => {
    return new Promise(async (resolve, reject)=>{
        try{
            let isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) resolve(true)
            resolve("Incorrect password")
            alert("Incorrect password")
        } catch(e){
            reject(e);
        }
    })
};

let findById = (id)=>{
    return new Promise(((resolve, reject)=>{
        try{
            const result = pool.query(`select * from registration where id = ${id}`, function(error, rows){
                if (error) reject (error);
                // console.log(result)
                resolve(rows[0]);                  
            })
        } catch(e) {

            reject(e);
        }
    }))
};



module.exports = {
    comparePasswordUser : comparePasswordUser,
    findUserByEmail : findUserByEmail,
    findById : findById
};