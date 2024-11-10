import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
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

  await connectToDatabase()

  try {
    // Check if the username exists
    const existingAdmin = await Admin.findOne({ username })
    if (!existingAdmin) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await compare(password, existingAdmin.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Successful login
    return NextResponse.json(
      { message: 'Login successful', username: existingAdmin.username },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
  }
}
