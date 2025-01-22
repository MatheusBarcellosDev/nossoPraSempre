import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import path from 'path';
import slugify from 'slugify';
import Stripe from 'stripe';
import { randomBytes } from 'crypto';

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
