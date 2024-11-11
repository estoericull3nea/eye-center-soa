import mongoose, { Schema, model, models } from 'mongoose'

interface IPatient {
  firstName: string
  lastName: string
  age: number
  address: string
  zipCode: string
  firstCaseRate: number
  secondCaseRate: number
  admittingDiagnosis: string
  dischargeDiagnosis: string
}

const patientSchema = new Schema<IPatient>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  firstCaseRate: { type: Number, required: true },
  secondCaseRate: { type: Number, required: true },
  admittingDiagnosis: { type: String, required: true },
  dischargeDiagnosis: { type: String, required: true },
})

export default models.Patient || model<IPatient>('Patient', patientSchema)
