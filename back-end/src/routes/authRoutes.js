import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Register new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { firstName, lastName, email, password, cpassword } = req.body

    // Validate input
    if (!firstName || !lastName || !email || !password || !cpassword) {
        return res.status(400).json({ message: 'Missing required fields' })
    }
    if (password !== cpassword) {
        return res.status(400).json({ message: 'Passwords do not match' })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        return res.status(500).json({ message: 'Server misconfigured: JWT secret not set' })
    }

    const hashedPassword = bcrypt.hashSync(password, 8)
    //Save new user and hashed password to db
    try {
        const insertUser = db.prepare(`INSERT INTO users(firstName, lastName, email, password)
            VALUES(?,?,?,?)`)
        const result = insertUser.run(firstName, lastName, email, hashedPassword)

        // Default application
        const defaultApp = 'Hello add your first application'
        const insertApp = db.prepare(`INSERT INTO applications(userID,position,employment, company,salary,location,status,date)
            VALUES(?,?,?,?,?,?,?,?)`)
        insertApp.run(
            result.lastInsertRowid, // userID
            defaultApp,             // position
            'full-time',            // employment
            '',                     // company
            0,                      // salary
            '',                     // location
            'applied',              // status
            '2025-01-01'            // date
        )

        //Create token
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET,
            { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE email = ?`)
        const user = getUser.get(email)
        //If we cannot find user associated with that username
        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordValid = bcrypt.compareSync(password, user.password)
        if (!passwordValid) { return res.status(401).send({ message: "Invalid Password" }) }
        console.log(user)
        //Then we have a succesful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        })
        res.json({ token })
    }
    catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router