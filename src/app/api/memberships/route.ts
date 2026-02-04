import { NextResponse } from 'next/server';
import { membershipService } from '@/backend/services/membershipService';

export async function GET() {
  try {
    const memberships = await membershipService.getAll();
    return NextResponse.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Basic validation
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const newMembership = await membershipService.create(body);
    return NextResponse.json(newMembership, { status: 201 });
  } catch (error) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: 'Failed to create membership' }, { status: 500 });
  }
}
