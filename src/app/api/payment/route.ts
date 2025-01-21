import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const plans = {
  basic: {
    price: 100, // R$ 1,00
    name: 'Plano Básico',
  },
  premium: {
    price: 2990, // R$ 29,90
    name: 'Plano Premium',
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { slug } = session.metadata || {};

    if (!slug) {
      return NextResponse.json(
        { error: 'No page found for this session' },
        { status: 404 }
      );
    }

    // Buscar a página no banco de dados
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Se o pagamento foi bem-sucedido, processar os dados finais
    if (session.payment_status === 'paid' && !page.isPago) {
      // Atualizar o status de pagamento
      await prisma.page.update({
        where: { slug },
        data: {
          isPago: true,
          // Aqui você pode adicionar outros campos que precisam ser atualizados
          // como as URLs das imagens do Cloudinary, etc.
        },
      });

      // Aqui você pode adicionar a lógica para processar as imagens no Cloudinary
      // e atualizar as URLs no banco de dados
    }

    return NextResponse.json({
      isPago: session.payment_status === 'paid',
      slug,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Error retrieving session' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, plano } = body;

    console.log('=== Payment POST ===');
    console.log('1. Received body:', { slug, plano });

    if (!slug || !plano) {
      return NextResponse.json(
        {
          error: 'Campos obrigatórios faltando',
          details: {
            slug: !!slug,
            plano: !!plano,
          },
        },
        { status: 400 }
      );
    }

    const selectedPlan = plans[plano as keyof typeof plans];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Plano inválido selecionado', plano },
        { status: 400 }
      );
    }

    // Buscar dados do TempData
    const tempDataResponse = await prisma.tempData.findUnique({
      where: { key: slug },
    });

    console.log('2. TempData response:', {
      found: !!tempDataResponse,
      key: slug,
      expiresAt: tempDataResponse?.expiresAt,
    });

    if (!tempDataResponse) {
      console.error('3. TempData não encontrado para o slug:', slug);
      return NextResponse.json(
        { error: 'Dados temporários não encontrados' },
        { status: 404 }
      );
    }

    // Parse dos dados temporários
    const parsedTempData = JSON.parse(tempDataResponse.data);
    console.log('4. Parsed TempData:', {
      nome1: parsedTempData.nome1,
      nome2: parsedTempData.nome2,
      plano: parsedTempData.plano,
    });

    const essentialData = {
      nome1: parsedTempData.nome1,
      nome2: parsedTempData.nome2,
      plano: parsedTempData.plano,
      template: parsedTempData.template,
    };

    // Criar a sessão do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: selectedPlan.name,
              description: `Página personalizada para ${essentialData.nome1} e ${essentialData.nome2}`,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}&temp_slug=${slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/criar/finalizar?slug=${slug}`,
      metadata: {
        slug,
        plano,
        tempDataKey: slug,
      },
    });

    if (!session?.url) {
      throw new Error('Não foi possível criar a URL de pagamento');
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao criar sessão de pagamento',
        details: error,
      },
      { status: 500 }
    );
  }
}

// Webhook para atualizar o status do pagamento
export async function PUT(request: Request) {
  try {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    if (!sig) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { slug } = session.metadata || {};

      if (slug) {
        // Atualizar o status de pagamento no banco de dados
        await prisma.page.update({
          where: { slug },
          data: { isPago: true },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
