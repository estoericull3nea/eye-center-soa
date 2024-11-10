// /app/api/register/route.ts
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { connectToDatabase, Admin } from '@/lib/db'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Username and Password is Required
  if (!username || !password) {
    return NextResponse.json(
      { message: 'Username and password are required' },
      { status: 400 }
    )
  }

  // Validate password strength
  if (
    password.length < 8 ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(password)
  ) {
    return NextResponse.json(
      {
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      },
      { status: 400 }
    )
  }

  await connectToDatabase()

  try {
    // Check if the username already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash the password and save the new admin
    const hashedPassword = await hash(password, 10)
    const newAdmin = new Admin({ username, password: hashedPassword })
    await newAdmin.save()

    return NextResponse.json(
      { message: 'Admin registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json(
      { message: 'Error creating admin' },
      { status: 500 }
    )
  }
}
