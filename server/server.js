import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

let context = {}

const openai = new OpenAIApi(configuration)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
})

app.post('/', async (req, res) => {
    let userContext = context
    try {
        const prompt = req.body.prompt
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.5,
            max_tokens: 3000,
            context: userContext,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0.0,
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })
        let newContext = response.data.choices[0].context
        context = newContext
    } catch (error) {
        console.log(error)
        res.status(500).send({ error })
    }
})

app.listen(5001, () => console.log('Server is running on port https://codex-deup.onrender.com'))

