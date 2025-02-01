import { prisma } from '@/lib/prisma';
import { sendSuccessEmail } from '@/lib/email';
import slugify from 'slugify';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';
import { OpenAI } from 'openai';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Base 36 timestamp
  const randomNum = Math.random().toString(36).substring(2, 8); // 6 caracteres aleatórios
  const randomHex = randomBytes(2).toString('hex'); // 4 caracteres hexadecimais
  return `${timestamp}${randomNum}${randomHex}`;
}

export async function POST(request: Request) {
  try {
    const { sessionId, tempData } = await request.json();

    if (!sessionId || !tempData) {
      console.error('2. Missing required data:', {
        hasSessionId: !!sessionId,
        hasTempData: !!tempData,
      });
      return new Response(
        JSON.stringify({
          error: 'Dados obrigatórios faltando',
        }),
        { status: 400 }
      );
    }

    // Verificar o status do pagamento
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return new Response(
        JSON.stringify({
          error: 'Pagamento não confirmado',
        }),
        { status: 400 }
      );
    }

    // Gerar um slug único
    const baseSlug = slugify(`${tempData.nome1}-e-${tempData.nome2}`, {
      lower: true,
      strict: true,
    });
    const uniqueId = generateUniqueId();
    const slug = `${baseSlug}-${uniqueId}`;

    // Upload das imagens para o storage permanente
    const uploadedImages = await Promise.all(
      tempData.fotos.map(async (foto: string) => {
        // Otimizar e fazer upload da imagem
        const optimizeResponse = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/optimize-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: foto,
              folder: `pages/${slug}`,
            }),
          }
        );

        if (!optimizeResponse.ok) {
          const error = await optimizeResponse.json();
          throw new Error(error.error || 'Erro ao otimizar imagem');
        }

        const { url } = await optimizeResponse.json();
        return url;
      })
    );

    // Criar a página no banco de dados
    const page = await prisma.page.create({
      data: {
        slug,
        nome1: tempData.nome1,
        nome2: tempData.nome2,
        data: tempData.data,
        mensagem: tempData.mensagem,
        fotos: uploadedImages,
        musica: tempData.musica,
        template: tempData.template,
        plano: tempData.plano,
        isPago: true,
        isPrivate: tempData.isPrivate || false,
        password: tempData.password,
        signo1: tempData.signo1,
        signo2: tempData.signo2,
      },
    });

    // Enviar email de confirmação
    if (session.customer_details?.email) {
      try {
        await sendSuccessEmail({
          nome1: tempData.nome1,
          nome2: tempData.nome2,
          slug: page.slug,
          email: session.customer_details.email,
          isPrivate: tempData.isPrivate,
          password: tempData.password,
        });
      } catch (error) {
        console.error('Erro ao enviar email:', error);
      }
    }

    // Verificar se o usuário optou por curiosidades sobre a data
    if (tempData.curiosidades) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
          Gere curiosidades sobre o dia ${tempData.data} em formato JSON. Inclua:
          - 3 músicas populares do ano em que essa data ocorreu
          - 3 eventos históricos que aconteceram EXATAMENTE neste dia e mês (independente do ano)
          - 3 curiosidades interessantes sobre este dia específico (como celebridades que nasceram nesta data, fatos históricos deste dia, ou eventos culturais que ocorrem tradicionalmente nesta data)
          
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

        const curiosidadesData = JSON.parse(response);

        // Atualizar a página com as curiosidades
        await prisma.page.update({
          where: { slug },
          data: {
            curiosidadesData: curiosidadesData,
          },
        });
      } catch (error) {
        console.error('Erro ao obter curiosidades:', error);
      }
    }

    // Limpar dados temporários
    await prisma.tempData
      .delete({
        where: { key: tempData.slug },
      })
      .catch(() => {}); // Ignora erro se os dados já foram limpos

    return new Response(JSON.stringify({ slug: page.slug }), {
      status: 200,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao processar pagamento',
      }),
      { status: 500 }
    );
  }
}
