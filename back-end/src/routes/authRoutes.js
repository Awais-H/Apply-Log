import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Register new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, cpassword } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)
    //Save new user and hashed password to db
    try {
        const insertUser = db.prepare(`INSERT INTO users(firstName, lastName, email, password)
            VALUES(?,?,?,?)`)
        const result = insertUser.run(firstName, lastName, email, hashedPassword)
        //Default application
        const defaultApp = 'Hello add your first application'
        const insertApp = db.prepare(`INSERT INTO applications(userID,position,employment, company,salary,location,status,date)
            VALUES(?,?,?,?,?,?,?,?)`)
        insertApp.run(result.lastInsertRowid, defaultApp, "", "full-time", "", 0, "", "applied", "2025-01-01")

        //Create token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET,
            { expiresIn: '24h' })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

    console.log(firstName, lastName, email, password, cpassword, hashedPassword)
    res.sendStatus(201)
})

router.post('/login', (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    res.sendStatus(200)
})

export default router