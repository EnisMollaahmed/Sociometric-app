import IStudent from "./student";
import { Question } from "./quesion";

export interface Survey {
    _id: string;
    title: string;
    students: IStudent[];
    description:string;
    questions:Question[];
    createdAt:string;
}