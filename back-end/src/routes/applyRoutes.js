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
    const { position, employment, company, salary, location, status, date } = req.body
    const insertApp = db.prepare(`INSERT INTO applications(userID,position,employment, company,salary,location,status,date)
    VALUES(?,?,?,?,?,?,?,?)`)
    const result = insertApp.run(
        req.userID, position, employment, company, salary, location, status, date
    )
    res.json({ id: result.lastInsertRowid, position, employment, company, salary, location, status, date })

})

router.put('/:id', (req, res) => {
    const { position, employment, company, salary, location, status, date } = req.body
    const { id } = req.params

    const updatedApp = db.prepare(`UPDATE applications SET position = ?, employment = ?, company = ?, salary = ?, location = ?, status = ?, date = ? WHERE id = ?`)
    updatedApp.run(position, employment, company, salary, location, status, date, Number(id))

    res.json({ message: "Application Updated" })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const deleteStmt = db.prepare(`DELETE FROM applications WHERE id = ?`)
    deleteStmt.run(Number(id))
    res.json({ message: "Application Deleted" })
})

export default router