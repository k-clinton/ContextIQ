// OpenAI API client for direct calls from frontend
// This is a temporary solution until edge functions are deployed with secrets

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Helper function to handle API errors with better messages
async function handleOpenAIError(response: Response) {
  const errorText = await response.text();
  let errorData;
  try {
    errorData = JSON.parse(errorText);
  } catch {
    errorData = { error: { message: errorText } };
  }

  console.error('OpenAI API error:', response.status, errorData);

  if (response.status === 429) {
    // Rate limit error
    if (errorData.error?.message?.includes('quota')) {
      throw new Error('OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing');
    } else {
      throw new Error('OpenAI API rate limit reached. Please wait a moment and try again.');
    }
  } else if (response.status === 401) {
    throw new Error('Invalid OpenAI API key. Please check your configuration.');
  } else if (response.status === 400) {
    throw new Error(`Invalid request: ${errorData.error?.message || 'Unknown error'}`);
  } else {
    throw new Error(`OpenAI API error (${response.status}): ${errorData.error?.message || 'Unknown error'}`);
  }
}

export async function analyzeText(text: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI text analyzer. Analyze the given text and provide: 1) Overall sentiment (positive/negative/neutral/mixed), 2) Key themes/topics, 3) Main keywords. Format your response as JSON.'
        },
        {
          role: 'user',
          content: `Analyze this text and return a JSON object with "sentiment", "themes" (array), and "keywords" (array):\n\n${text}`
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'analyze_text',
            description: 'Analyze text for sentiment, themes, and keywords',
            parameters: {
              type: 'object',
              properties: {
                sentiment: {
                  type: 'string',
                  enum: ['positive', 'negative', 'neutral', 'mixed']
                },
                themes: {
                  type: 'array',
                  items: { type: 'string' }
                },
                keywords: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['sentiment', 'themes', 'keywords'],
              additionalProperties: false
            }
          }
        }
      ],
      tool_choice: { type: 'function', function: { name: 'analyze_text' } }
    }),
  });

  if (!response.ok) {
    await handleOpenAIError(response);
  }

  const data = await response.json();
  const toolCall = data.choices[0].message.tool_calls?.[0];
  const analysis = toolCall ? JSON.parse(toolCall.function.arguments) : {
    sentiment: 'neutral',
    themes: ['general'],
    keywords: ['text']
  };

  return { analysis };
}

export async function summarizeText(text: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise, clear summaries of text. Focus on key points and main ideas. Keep summaries under 150 words.'
        },
        {
          role: 'user',
          content: `Please summarize the following text:\n\n${text}`
        }
      ],
    }),
  });

  if (!response.ok) {
    await handleOpenAIError(response);
  }

  const data = await response.json();
  const summary = data.choices[0].message.content;

  return { summary };
}

export async function chatWithAI(message: string, context?: string, conversationHistory: any[] = []) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const systemMessage = {
    role: 'system',
    content: `You are ContextIQ, a helpful AI assistant that answers questions about content. ${
      context ? `Here is the context to reference:\n\n${context.substring(0, 4000)}` : 'Answer questions helpfully and accurately.'
    }\n\nProvide clear, concise answers based on the context and conversation history.`
  };

  const messages = [
    systemMessage,
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    await handleOpenAIError(response);
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  return { response: aiResponse };
}
