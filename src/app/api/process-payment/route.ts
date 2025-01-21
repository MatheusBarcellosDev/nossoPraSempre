import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { sendSuccessEmail } from '@/lib/email';

// Configurar o Cloudinary com as credenciais corretas
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxgqvvnxz',
  api_key: process.env.CLOUDINARY_API_KEY || '117616959891498',
  api_secret:
    process.env.CLOUDINARY_API_SECRET || 'ZdW8FniJ9R9EnQxC87pE4DrqQZw',
  secure: true,
});

export async function POST(request: Request) {
  try {
    const { tempSlug, sessionId, tempData } = await request.json();

    console.log('Iniciando processamento de pagamento:', {
      tempSlug,
      hasSessionId: !!sessionId,
    });

    if (!tempSlug || !sessionId || !tempData) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verificar o status do pagamento
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Status do pagamento:', session.payment_status);
    console.log('Email do cliente:', session.customer_details?.email);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Pagamento não confirmado' },
        { status: 400 }
      );
    }

    console.log('Iniciando upload das imagens...');

    // Upload das imagens base64 para o Cloudinary
    const uploadedImages = await Promise.all(
      tempData.fotos.map(async (foto: string, index: number) => {
        try {
          console.log(`Processando imagem ${index + 1}...`);

          // Verificar se a foto já é uma URL do Cloudinary
          if (foto.startsWith('https://res.cloudinary.com')) {
            console.log(`Imagem ${index + 1} já é uma URL do Cloudinary`);
            return foto;
          }

          // Upload da imagem base64
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              foto,
              {
                folder: 'casal-web',
                upload_preset: 'casal-web',
                resource_type: 'image',
                timeout: 120000, // 2 minutos de timeout
              },
              (error, result) => {
                if (error) {
                  console.error(
                    `Erro no upload da imagem ${index + 1}:`,
                    error
                  );
                  reject(error);
                } else {
                  console.log(
                    `Imagem ${index + 1} enviada com sucesso:`,
                    result
                  );
                  resolve(result);
                }
              }
            );
          });

          return (result as any).secure_url;
        } catch (error) {
          console.error(`Erro ao processar imagem ${index + 1}:`, error);
          throw error;
        }
      })
    );

    console.log('Upload de imagens concluído');

    // Criar slug final baseado nos nomes
    const slugify = require('slugify');
    const baseSlug = slugify(`${tempData.nome1}-e-${tempData.nome2}`, {
      lower: true,
      strict: true,
    });

    // Verificar se o slug já existe
    let finalSlug = baseSlug;
    let counter = 1;
    let existingPage = await prisma.page.findUnique({
      where: { slug: finalSlug },
    });

    while (existingPage) {
      finalSlug = `${baseSlug}-${counter}`;
      existingPage = await prisma.page.findUnique({
        where: { slug: finalSlug },
      });
      counter++;
    }

    console.log('Salvando dados no banco...');

    // Salvar os dados finais no banco
    const page = await prisma.page.create({
      data: {
        nome1: tempData.nome1,
        nome2: tempData.nome2,
        data: tempData.data,
        mensagem: tempData.mensagem,
        template: tempData.template,
        musica: tempData.musica,
        fotos: uploadedImages,
        slug: finalSlug,
        plano: tempData.plano,
        isPago: true,
      },
    });

    console.log('Processamento concluído com sucesso');

    // Enviar email com os dados da página
    if (session.customer_details?.email) {
      await sendSuccessEmail({
        nome1: tempData.nome1,
        nome2: tempData.nome2,
        slug: page.slug,
        email: session.customer_details.email,
      });
    }

    return NextResponse.json({
      success: true,
      slug: page.slug,
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
