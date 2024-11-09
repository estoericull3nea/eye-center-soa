// /app/api/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectToDatabase, Admin } from '@/lib/db';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
  }

  await connectToDatabase();

  const hashedPassword = await hash(password, 10);

  try {
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    return NextResponse.json({ message: 'Admin registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating admin' }, { status: 500 });
  }
}
