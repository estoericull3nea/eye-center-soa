import mongoose, { Schema, model, models } from 'mongoose'

interface IPatient {
  firstName: string
  lastName: string
  age: number
  address: string
  zipCode: string
}

const patientSchema = new Schema<IPatient>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  { timestamps: true }
)

export default models.Patient || model<IPatient>('Patient', patientSchema)
