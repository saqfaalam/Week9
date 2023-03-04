const jwt = require ("jsonwebtoken");
const secretKey = "Rahasia";
const pool = require("../config.js");



function authentication (req, res, next) {

    const {access_token} = req.headers;

    if(access_token) {
        //berhasil login
        try{
            const decoded = jwt.verify(access_token, secretKey);

            const {id, email, username} = decoded

            const findUsers = `
                SELECT * FROM users
                WHERE id = $1;
            `

            pool.query(findUsers, [id], (err, result) => {

                if(err) next(err)

                if (result.rows.length === 0) {
                    next({name: "errornotfound"})
                } else {
                    const users = result.row[0]

                    req.loggedUser = {
                        id : users.id,
                        email: users.email,
                        genres: user.genres
                    }
                    next();
                }
            })

        } catch(err) {
            next({name: "JWTerror"})
        }
    } else {
        //gagal login
        next({name: "Unauthenthicated"})
    }
}

function authorization (req, res, next) {

    console.log (req.loggedUser);
    const {is_admin, email, gender, id} = req.loggedUser;

    if(is_admin) {
        next();

    } else {
        next({name: "Unauthorized"})

    }
}

module.exports = {
    authentication,
    authorization
}
