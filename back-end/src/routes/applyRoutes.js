import express from 'express'
import prisma from '@prisma/client'


const router = express.Router()

//get All applications for logged in user
router.get('/', async (req, res) => {
    const apps = await prisma.app.findMany({
        where: {
            userId: req.userId()
        }
    })

    res.json(apps)
})

router.post('/', async (req, res) => {
    const { position, employment, company, salary, location, status, date } = req.body

    const apps = await prisma.app.create({
        data: {
            position, employment, company, salary, location, status, date, userId: req.userId
        }
    })

    res.json(app)

})

router.put('/:id', async (req, res) => {
    const { position, employment, company, salary, location, status, date } = req.body
    const { id } = req.params

    const updatedApp = await prisma.app.update({
        where: {
            id: parseInt(id),
            userId: req.userId
        },
        data: {
            position, employment, company, salary, location, status, date
        }
    })

    res.json(updatedApp)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const userId = req.userId
    await prisma.app.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    const deleteStmt = db.prepare(`DELETE FROM applications WHERE id = ?`)
    deleteStmt.run(Number(id))
    res.json({ message: "Application Deleted" })
})

export default router