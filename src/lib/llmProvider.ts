import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

export interface LlmRequest {
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
}

export interface LlmResponse {
  text: string
  provider: 'anthropic' | 'openrouter'
  model: string
}

function getProvider(): 'anthropic' | 'openrouter' {
  const p = process.env.LLM_PROVIDER ?? 'anthropic'
  if (p !== 'anthropic' && p !== 'openrouter') {
    throw new Error(`LLM_PROVIDER must be 'anthropic' or 'openrouter', got '${p}'`)
  }
  return p
}

async function callAnthropic(req: LlmRequest): Promise<LlmResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const client = new Anthropic({ apiKey })
  const model = 'claude-haiku-4-5-20251001'

  const message = await client.messages.create({
    model,
    max_tokens: req.maxTokens ?? 400,
    temperature: req.temperature ?? 0.3,
    system: req.systemPrompt,
    messages: [{ role: 'user', content: req.userPrompt }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected content block type from Anthropic')

  return { text: block.text, provider: 'anthropic', model }
}

async function callOpenRouter(req: LlmRequest): Promise<LlmResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const model = process.env.OPENROUTER_MODEL ?? 'google/gemini-2.5-flash-preview'

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  })

  const response = await client.chat.completions.create({
    model,
    max_tokens: req.maxTokens ?? 400,
    temperature: req.temperature ?? 0.3,
    messages: [
      { role: 'system', content: req.systemPrompt },
      { role: 'user', content: req.userPrompt },
    ],
  })

  const text = response.choices[0]?.message?.content
  if (!text) throw new Error('Empty response from OpenRouter')

  return { text, provider: 'openrouter', model }
}

export async function callLlm(req: LlmRequest): Promise<LlmResponse> {
  const provider = getProvider()
  return provider === 'anthropic' ? callAnthropic(req) : callOpenRouter(req)
}
