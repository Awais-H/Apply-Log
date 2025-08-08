import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express()

const PORT = process.env.PORT || 5000

//Get the file path from the current module 
const __filename = fileURLToPath(import.meta.url)
//Get directory name of file path of front end files
const __dirname = dirname(__filename)


//Serves HTML file from the correct directory
//Tells express to serve all files from this directory
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'src')))

//Serving files from my front-end
app.get('/', (req, res) => {
    console.log('Sent front page')
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'src', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server has started ${PORT}`)
})