const express = require("express")
const router = express.Router();
const pool = require("../config.js");

router.get("/users", (req, res, next)=> {

    const findQuery = `
    SELECT * FROM users
    ORDER BY id;

    `
    pool.query(findQuery, (err, result) => {
        if(err) next(err)

        res.status(200).json(result.rows);

    })

})

router.get("/users/:id", (req, res, next)=> {

    const {id} = req.params;

    const findOneQuery = `
    SELECT * FROM users
    WHERE id = $1
    `

    pool.query(findOneQuery, [id], (err, result) => {
        if (err) next(err)

        if(result.rows.length === 0) {
            //NOT FOUND
            next({name: "ErrorNotFound"})
        } else {
            //FOUND
            res.status(200).json(result.rows[0]);
        }
   })
})

router.post("/users", (req, res, next) => {
    const {id, email, gender, password, role} = req.body;

    const createUsers = `
        INSERT INTO movies (id, email, gender, password, role)
            VALUES
            ($1, $2, $3, $4, $5);
       
    `
    
    pool.query(createUsers, [id, email, gender, password, role], (err, result) => {
        if(err) next (err)

        res.status(201).json({
            message :"Users created successfully"
        })
            
    })
})

router.put("/users/:id", (req, res, next) => {
    const {id} = req.params;
    const {title, email} = req.body;

    const updateUsers = `
        UPDATE users
        SET email = $1,
            gender = $2,
        WHERE id = $3
    `

    pool.query(updateMovies, [title, gender, id], (err, result) => {
        if(err) next(err)

        res.status(200).json({
            message : "Update Successfully"
        })
    })
})

router.delete("/users/:id", (req, res, next) => {

    const {id} = req.params;

    const deleteUsers = `
        DELETE FROM users
        WHERE id = $1;
    `

    pool.query(deleteUsers, [id], (err, result) => {
        if(err) next (err)

        res.status(200).json({
            message:"Movies deleted successfully"
        })
    } )
})


module.exports = router;