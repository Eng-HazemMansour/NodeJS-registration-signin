const pool = require ("../../config/database");

module.exports = {
    create: (data, callback) =>{
        pool.query(
            `INSERT INTO registration(firstName, secondName, gender, email, password, number) values(?,?,?,?,?,?)`,
                [
                    data.first_name,
                    data.second_name,
                    data.gender,
                    data.email,
                    data.password,
                    data.number
                ],
                (error, results, fields) => {
                    if (error){
                        return callback(error)
                    }
                    return callback(null, results)
                }
        );
    },
    getUsers: callback =>{
        pool.query(
            `select id, firstName, secondName, gender, email, number from registration`,
            [],
            (error, results, fields) => {
                if (error){
                    return callback(error);
                }
                return callback(null, results)
            }
        );
    },
    getUserById: (id, callback) =>{
        pool.query(
            `select id, firstName, secondName, gender, email, number from registration where id = ?`,
            [id],
            (error, results, fields) => {
                if (error){
                    return callback(error);
                }
                return callback(null, results[0])
            }
        );
    },
    updateUser: (data, callback) =>{
        pool.query(
            `update registration set firstName=?, secondName=?, gender=?, email=?, password=?, number=? where id = ?`,
            [
                data.first_name,
                data.second_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.id
            ],
            (error, results, fields) => {
                if (error){
                    return callback(error);
                }
                return callback(null, results)
            }
        );
    },
    deleteUser: (data, callback) =>{
        pool.query(
            `delete from registration where id = ?`,
            [data.id],
            (error, results, fields) => {
                if (error){
                    return callback(error);
                }
                return callback(null, results[0])
            }
        );
    },
    getUserByEmail: (email, callback) =>{
        pool.query(
            `select email from registration where email = ?`,
            [email],
            (error, results, fields) => {
                if (error){
                    callback(error);
                }
                return callback(null, results[0])
            }
        );
    },
};