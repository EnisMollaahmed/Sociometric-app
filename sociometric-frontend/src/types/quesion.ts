export interface Question{
    _id:string
    content:string
    type:"single" | "multiple"
    category:'sociometric' | 'preference' | 'behavioral'
}