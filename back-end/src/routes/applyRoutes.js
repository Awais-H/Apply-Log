import express from 'express'
import db from '../db.js'

const router = express.Router()

//get All applications for logged in user
router.get('/', (req, res) => {
    const getApps = db.prepare(`SELECT * FROM applications WHERE userID = ?`)
    const apps = getApps.all(req.userID)
    res.json(apps)
})

router.post('/', (req, res) => {

})

router.put('/:id', (req, res) => {

})

router.delete('/id', (req, res) => {

})

export default router