import { NextResponse } from 'next/server';
import { inquiryService } from '@/backend/services/inquiryService';

// GET: Fetch all inquiries (Admin only)
export async function GET() {
  // In a real app, we would check the 'auth_token' cookie here to ensure the user is an admin
  try {
    const inquiries = await inquiryService.getAll();
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// POST: Submit a new inquiry (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, plan, subject, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone Number are required' }, { status: 400 });
    }

    const newInquiry = await inquiryService.create({ 
      name, 
      email: email || '', 
      phone, 
      address: address || '', 
      plan: plan || 'General', 
      subject: subject || 'General Inquiry', 
      message: message || '' 
    });
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
