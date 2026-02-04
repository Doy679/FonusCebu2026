import { NextResponse } from 'next/server';
import { membershipService } from '@/backend/services/membershipService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const membership = await membershipService.getById(id);
    if (!membership) {
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 });
    }
    return NextResponse.json(membership);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedMembership = await membershipService.update(id, body);
    return NextResponse.json(updatedMembership);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await membershipService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete membership' }, { status: 500 });
  }
}
