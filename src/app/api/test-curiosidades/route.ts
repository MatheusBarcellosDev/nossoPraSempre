import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    const prompt = `
      Gere curiosidades sobre a data ${data} em formato JSON. Inclua:
      - 3 músicas populares do ano
      - 3 eventos históricos importantes
      - 3 curiosidades interessantes
      
      Responda apenas com o JSON no seguinte formato:
      {
        "musicas": ["música 1", "música 2", "música 3"],
        "eventos": ["evento 1", "evento 2", "evento 3"],
        "curiosidades": ["curiosidade 1", "curiosidade 2", "curiosidade 3"]
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: prompt }],
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('Sem resposta da API');
    }

    return NextResponse.json(JSON.parse(response));
  } catch (error) {
    console.error('Erro ao gerar curiosidades:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar curiosidades' },
      { status: 500 }
    );
  }
}
