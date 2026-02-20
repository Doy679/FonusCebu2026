import { NextResponse } from 'next/server';
import { inquiryService } from '@/backend/services/inquiryService';

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiry = await inquiryService.getById(id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update an inquiry (e.g., status)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedInquiry = await inquiryService.update(id, body);
    
    if (!updatedInquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}