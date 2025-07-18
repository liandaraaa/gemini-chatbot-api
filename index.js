import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAi.getGenerativeModel({model:'gemini-1.5-flash'})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message

  if(!userMessage){
    return res.status(400).json({error: 'No message provided'})
  }
  
  try {
    const result = await model.generateContent(userMessage)
    const response = await result.response
    const text = response.text()
    res.json({reply: text})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: 'Something went wrong'})
  }
}
)