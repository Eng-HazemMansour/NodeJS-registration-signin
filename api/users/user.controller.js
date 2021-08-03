const {create, getUserById, getUsers, updateUser, deleteUser, getUserByEmail} = require("./user.service");
const {genSaltSync, hashSync, compareSync, compare} = require("bcrypt");
const {sign} = require("jsonwebtoken");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) =>{
            if (err){
                console.log(err);
                return res.status(500).json({
                    message : "Database connection error"
                });
            }
            return res.status(200).json({
                data : results
            });
        });
    },
    getUserById: (req, res) => {
        const id = req.params.id;
        getUserById(id, (err, results)=>{
            if (err){
                console.log(err);
                return;
            }
            if (!results){
                return res.json({
                    message : "Record not found"
                });
            }
            return res.json({
                data : results
            });
        });
    },
    getUsers: (req, res) =>{
        getUsers((err, results)=>{
            if (err){
                console.log(err);
                return;
            }
            return res.json({
                data : results
            });
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results)=>{
            if (err){
                console.log(err);
                return false;
            }
            if (!results){
                return res.json({
                    message : "Failed to update"
                });
            }
            return res.json({
                message : "Updated successfully"
            });
        });
    },
    deleteUser : (req, res) =>{
        const data = req.body;
        deleteUser(data, (err, results)=>{
            if (err){
                console.log(err);
                return;
            }
            if (!results){
                return res.json({
                    message : "User not found"
                });
            }
            return res.json({
                message : "User deleted successfully"
            });
        });
    },
    login : (req, res) =>{
        const body = req.body;
        getUserByEmail(body.email, (err, results) =>{
            if (err){
                console.log(err)
            }
            if (!results){
                return res.json({
                    message : "Please enter an email and a password"
                });
            }
            const result = compareSync(body.password, results.password);
            
            if (result){
                results.password = undefined;
                const jsontoken = sign({ result : results }, process.env.SECRET_KEY, { expiresIn : "1h" });
                return res.json({
                    message : "Logged in successfully",
                    token : jsontoken
                });
            }
            
            else {
                console.log(body.email)
                console.log(body.password)
                console.log(results.password)
                console.log(result)
                return res.json({
                    message : "Invalid email or password"
                });
            }
        });
    },
};