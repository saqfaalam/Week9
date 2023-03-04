const express = require("express")
const router = express.Router();
const moviesRouter = require("./movies.js")
const pool = require("../config.js");
const bcrypt = require("bcrypt")
const salt = bcrypt.genSaltSync(10);
const jwt = require ("jsonwebtoken");
const secretKey = "Rahasia";
const {authentication} = require("../middlewares/auth.js");


router.post("/login", (req, res, next) => {
    const {email, password} = req.body;

    const findUsers = `
        SELECT * FROM users
        WHERE email = $1
    `

    pool.query(findUsers, [email], (err, result) => {
        if(err) next(err)

        if(result.rows.length === 0 ) {
            next({name: "ErrorNotFound"})

        } else {
            const data = result.rows[0]
            const comparePassword = bcrypt.compareSync(password, data.password);

            if(comparePassword) {
                //TRUE
                const accessToken = jwt.sign({
                    id: data.id,
                    email: data.email,
                    gender: data.gender
                }, secretKey)

                res.status(200).json({
                    id: data.id,
                    email: data.email,
                    gender: data.gender,
                    is_admin: data.is_admin,
                    accessToken: accessToken
                })

            } else {
                //FALSE
                next({name: "Wrong Password"})
            }
        }
    })

})



router.post("/register", (req, res, next) => {
    const {email, gender, password, role} = req.body;

    const hash = bcrypt.hashSync(password, salt);

    const InsertUsers =    `
        INSERT INTO users (email, gender, password, role)
            VALUES
            ($1, $2, $3, $4)
        
    `

    pool.query(InsertUsers, [email, gender, password, role], (err, result) => {
        if(err) next(err)

        res.status(201).json({
            message : "users registered"
        })
    })
})


router.use(authentication)

router.use("/", moviesRouter)

module.exports = router;