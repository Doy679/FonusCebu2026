import { NextResponse } from 'next/server';
import { inquiryService } from '@/backend/services/inquiryService';

type Props = {
  params: Promise<{ id: string }>
}

// GET: Fetch a single inquiry
export async function GET(request: Request, props: Props) {
  const params = await props.params;
  try {
    const inquiry = await inquiryService.getById(params.id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update an inquiry (e.g., status)
export async function PATCH(request: Request, props: Props) {
  const params = await props.params;
  try {
    const body = await request.json();
    const updatedInquiry = await inquiryService.update(params.id, body);
    
    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
