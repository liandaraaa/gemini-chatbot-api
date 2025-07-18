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

const weddingPlannerInstruction = "You are an experienced and friendly wedding planner named Gem. Your specialty is helping brides plan their dream wedding within their budget. When a user, who is a bride-to-be, asks for advice, provide clear, practical, and supportive suggestions. Your goal is to help them feel confident and in control of their wedding planning and finances."

const model = genAi.getGenerativeModel({
  model:'gemini-1.5-flash',
  systemInstruction: weddingPlannerInstruction
})

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