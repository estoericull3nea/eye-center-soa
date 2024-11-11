import mongoose, { Schema, model, models } from 'mongoose'

interface IPatient {
  firstName: string
  lastName: string
  age: number
  address: string
  zipCode: string
}

const patientSchema = new Schema<IPatient>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
})

export default models.Patient || model<IPatient>('Patient', patientSchema)
