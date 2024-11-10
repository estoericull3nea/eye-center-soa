import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { connectToDatabase, Admin } from '@/lib/db'

const MAX_ATTEMPTS = 5
const BLOCK_TIME_MS = 10 * 60 * 1000 // 10 minutes

// In-memory rate limiter
const loginAttempts = new Map<
  string,
  { attempts: number; lastAttempt: number }
>()

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Username and Password is Required
  if (!username || !password) {
    return NextResponse.json(
      { message: 'Username and password are required' },
      { status: 400 }
    )
  }

  // Get user's IP address
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('host') ||
    'unknown-ip'

  // Check rate limiting
  const userAttempts = loginAttempts.get(ip) || {
    attempts: 0,
    lastAttempt: Date.now(),
  }

  if (
    userAttempts.attempts >= MAX_ATTEMPTS &&
    Date.now() - userAttempts.lastAttempt < BLOCK_TIME_MS
  ) {
    return NextResponse.json(
      { message: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    )
  }

  await connectToDatabase()

  try {
    // Check if the username exists
    const existingAdmin = await Admin.findOne({ username })
    if (!existingAdmin) {
      // Update rate limit attempt count
      loginAttempts.set(ip, {
        attempts: userAttempts.attempts + 1,
        lastAttempt: Date.now(),
      })
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Compare the password with the hashed password in the database
    const isPasswordValid = await compare(password, existingAdmin.password)
    if (!isPasswordValid) {
      // Update rate limit attempt count
      loginAttempts.set(ip, {
        attempts: userAttempts.attempts + 1,
        lastAttempt: Date.now(),
      })
      return NextResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Successful login - reset attempts for this IP
    loginAttempts.delete(ip)
    return NextResponse.json(
      { message: 'Login successful', username: existingAdmin.username },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ message: 'Error logging in' }, { status: 500 })
  }
}
