import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // Fetch the audio file
    const response = await fetch(audioUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch audio file')
    }

    // Convert to File object for OpenAI
    const blob = await response.blob()
    const file = new File([blob], 'audio.mp3', { type: blob.type })

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    })

    return transcription.text
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export async function generateSummary(transcript: string): Promise<{
  summary: string
  actionItems: Array<{
    description: string
    assignee?: string
    priority: 'low' | 'medium' | 'high'
  }>
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are an expert meeting summarizer. Your task is to:
1. Create a concise summary of the meeting (2-3 paragraphs)
2. Extract all action items with clear descriptions
3. Identify assignees when mentioned (look for phrases like "John will...", "assigned to Sarah", etc.)
4. Assign priority levels based on urgency indicators

Return the response in JSON format with this structure:
{
  "summary": "meeting summary here",
  "actionItems": [
    {
      "description": "action item description",
      "assignee": "person name or null",
      "priority": "low|medium|high"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Please summarize this meeting transcript and extract action items:\n\n${transcript}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return {
      summary: result.summary || '',
      actionItems: result.actionItems || []
    }
  } catch (error) {
    console.error('Summary generation error:', error)
    throw new Error('Failed to generate summary')
  }
}