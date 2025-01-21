import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import path from 'path';
import slugify from 'slugify';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { tempSlug, sessionId, tempData } = await request.json();

    console.log('=== Process Payment POST ===');
    console.log('1. Received data:', {
      tempSlug,
      hasSessionId: !!sessionId,
      hasTempData: !!tempData,
    });

    if (!tempSlug || !sessionId || !tempData) {
      console.error('2. Missing required data:', {
        hasTempSlug: !!tempSlug,
        hasSessionId: !!sessionId,
        hasTempData: !!tempData,
      });
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar o status do pagamento
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('3. Stripe session status:', {
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Pagamento não confirmado' },
        { status: 400 }
      );
    }

    console.log('Iniciando upload das imagens...');

    // Usar as URLs que já estão no Supabase
    const uploadedImages = tempData.fotos;

    // Criar slug final baseado nos nomes
    const baseSlug = slugify(`${tempData.nome1}-e-${tempData.nome2}`, {
      lower: true,
      strict: true,
    });

    // Verificar se o slug já existe
    let finalSlug = baseSlug;
    let counter = 1;

    await prisma.$transaction(async (tx) => {
      // Verificar se já existe
      const existingPage = await tx.page.findUnique({
        where: { slug: finalSlug },
      });

      if (!existingPage) {
        // Após confirmação do pagamento
        const finalImages = await Promise.all(
          uploadedImages.map(async (url: string) => {
            // Se a imagem já está no bucket temporário, mover para pasta final
            if (url.includes('wedding-photos')) {
              const oldPath = url.split('wedding-photos/')[1];
              const newPath = `final/${tempData.nome1}-${
                tempData.nome2
              }/${path.basename(oldPath)}`;

              await supabase.storage
                .from('wedding-photos')
                .move(oldPath, newPath);

              return supabase.storage
                .from('wedding-photos')
                .getPublicUrl(newPath).data.publicUrl;
            }

            return url;
          })
        );

        // Salvar página com as novas URLs
        await tx.page.create({
          data: {
            nome1: tempData.nome1,
            nome2: tempData.nome2,
            data: tempData.data,
            mensagem: tempData.mensagem,
            template: tempData.template,
            musica: tempData.musica,
            fotos: finalImages,
            slug: finalSlug,
            plano: tempData.plano,
            isPago: true,
          },
        });
      }
    });

    console.log('Processamento concluído com sucesso');

    // Enviar email com os dados da página
    if (session.customer_details?.email) {
      await sendSuccessEmail({
        nome1: tempData.nome1,
        nome2: tempData.nome2,
        slug: finalSlug,
        email: session.customer_details.email,
      });
    }

    return NextResponse.json({
      success: true,
      slug: finalSlug,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao processar dados do pagamento',
        details: error,
      },
      { status: 500 }
    );
  }
}
