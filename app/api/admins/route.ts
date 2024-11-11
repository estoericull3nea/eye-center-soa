import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Admin from '../../models/Admin'

// Ensure database connection is established when this module is loaded
await connectToDatabase()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body

    const newAdmin = new Admin({
      username,
      password,
    })

    await newAdmin.save()

    return NextResponse.json({ data: newAdmin }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating Admin', error },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const admins = await Admin.find() // Fetch all admins from the database
    return NextResponse.json(admins, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching Admins', error },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // Get the Admin ID from query parameters

    if (!id) {
      return NextResponse.json(
        { message: 'Admin ID is required' },
        { status: 400 }
      )
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id) // Delete the Admin by ID

    if (!deletedAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting Admin', error },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') // Get the Admin ID from query parameters

    if (!id) {
      return NextResponse.json(
        { message: 'Admin ID is required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const updatedFields = {
      username: body.username,
      password: body.password,
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedFields, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation is applied to updated fields
    })

    if (!updatedAdmin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({ data: updatedAdmin }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating Admin', error },
      { status: 500 }
    )
  }
}
