import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const plans = {
  basic: {
    price: 1990, // R$ 19,90
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

    // Se o pagamento foi bem-sucedido, atualizar o status no banco
    if (session.payment_status === 'paid' && !page.isPago) {
      await prisma.page.update({
        where: { slug },
        data: { isPago: true },
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
      { error: 'Error retrieving session' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, plano } = body;

    if (!slug || !plano) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const selectedPlan = plans[plano as keyof typeof plans];
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: selectedPlan.name,
              description: 'Página personalizada para seu amor',
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/criar/finalizar?slug=${slug}`,
      metadata: {
        slug,
        plano,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
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
