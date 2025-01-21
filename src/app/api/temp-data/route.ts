import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tempData, slug } = body;

    console.log('=== TempData POST ===');
    console.log('1. Saving data:', {
      slug,
      hasData: !!tempData,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    const savedTempData = await prisma.tempData.create({
      data: {
        key: slug,
        data: JSON.stringify(tempData),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    console.log('2. Data saved successfully:', {
      key: savedTempData.key,
      expiresAt: savedTempData.expiresAt,
    });

    return NextResponse.json({ success: true, key: savedTempData.key });
  } catch (error) {
    console.error('3. Error saving temp data:', error);
    return NextResponse.json(
      { error: 'Error saving temporary data' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    console.log('=== TempData GET ===');
    console.log('1. Fetching data for key:', key);

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    const tempData = await prisma.tempData.findUnique({
      where: { key },
    });

    console.log('2. Found data:', {
      found: !!tempData,
      key,
      expiresAt: tempData?.expiresAt,
    });

    if (!tempData) {
      return NextResponse.json(
        { error: 'Temporary data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: JSON.parse(tempData.data) });
  } catch (error) {
    console.error('Error fetching temp data:', error);
    return NextResponse.json(
      { error: 'Error fetching temporary data' },
      { status: 500 }
    );
  }
}
