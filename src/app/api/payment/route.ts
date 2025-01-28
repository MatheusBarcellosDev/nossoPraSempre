import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const plans = {
  basic: {
    price: 1990, // R$ 19,90
    name: 'Plano Básico',
  },
  premium: {
    price: 2490, // R$ 24,90
    name: 'Plano Premium',
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID não fornecido' },
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
        },
      });
    }

    return NextResponse.json({
      isPago: session.payment_status === 'paid',
      slug,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status do pagamento' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { slug, plano } = await request.json();

    if (!slug || !plano || !plans[plano as keyof typeof plans]) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
        },
        { status: 400 }
      );
    }

    // Buscar dados temporários usando Prisma
    const tempData = await prisma.tempData.findUnique({
      where: { key: slug },
    });

    if (!tempData || new Date() > tempData.expiresAt) {
      console.error('3. TempData não encontrado para o slug:', slug);
      return NextResponse.json(
        { error: 'Dados temporários não encontrados ou expirados' },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: plans[plano as keyof typeof plans].name,
              description: `Acesso ${
                plano === 'basic' ? 'por 1 ano' : 'vitalício'
              } à sua página especial`,
            },
            unit_amount: plans[plano as keyof typeof plans].price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}&temp_slug=${slug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/criar/finalizar?slug=${slug}`,
      metadata: { slug }, // Adicionando o slug aos metadados da sessão
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento' },
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
