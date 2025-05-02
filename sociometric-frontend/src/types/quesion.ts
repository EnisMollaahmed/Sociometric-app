/*
content: { type: String, required: true },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  category: { type: String, enum: ['sociometric', 'preference', 'behavioral'], required: true }
*/

export interface Question{
    _id:string
    content:string
    type:"single" | "multiple"
    category:'sociometric' | 'preference' | 'behavioral'
}