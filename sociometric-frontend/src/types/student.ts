export default interface IStudent{
    _id:string,
    name:string,
    hash:string,
    survey:string,
    class:string,
    responses:{questionId:string, selectedStudents:string[]}[],
    hasCompleted:boolean
}