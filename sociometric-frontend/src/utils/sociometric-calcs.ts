import IStudent from "../types/student";
import { Survey } from "../types/survey";



export function formatSurveyDate(dateString: string): string {
  try {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid date' 
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
  } catch {
    return 'Invalid date';
  }
}

export function calculateParticipationRate(students: IStudent[]): string {
  if (!students || students.length === 0) return '0%';
  
  const completedCount = students.filter(student => student.hasCompleted).length;
  const participation = (completedCount / students.length) * 100;
  
  // Fix: Ensure the percentage is between 0-100 and has no decimal places
  return `${Math.min(100, Math.max(0, Math.round(participation)))}%`;
}

export function getMostPopularStudent(survey: Survey): string {
  if (!survey.students || survey.students.length === 0) return 'N/A';
  
  // This is simplified - implement your actual sociometric analysis logic here
  const studentVotes = new Map<string, number>();
  
  survey.students.forEach(student => {
    student.responses?.forEach(response => {
      response.selectedStudents?.forEach(selectedId => {
        const selectedStudent = survey.students.find(s => s._id === selectedId);
        if (selectedStudent) {
          studentVotes.set(
            selectedStudent.name, 
            (studentVotes.get(selectedStudent.name) || 0) + 1
          );
        }
      });
    });
  });

  let popularStudent = 'N/A';
  let maxVotes = 0;
  studentVotes.forEach((votes, name) => {
    if (votes > maxVotes) {
      maxVotes = votes;
      popularStudent = name;
    }
  });
  return popularStudent;
}

export function getMostRejectedStudent(survey: Survey): string {
  if (!survey.students || survey.students.length === 0) return 'N/A';
  
  // This is simplified - implement your actual rejection analysis logic here
  const studentRejections = new Map<string, number>();
  
  // Count how many times each student wasn't selected
  const allStudents = survey.students.map(s => s._id);
  
  survey.students.forEach(student => {
    const selectedStudents = new Set(
      student.responses?.flatMap(r => r.selectedStudents) || []
    );
    
    allStudents.forEach(studentId => {
      if (!selectedStudents.has(studentId)) {
        const student = survey.students.find(s => s._id === studentId);
        if (student) {
          studentRejections.set(
            student.name,
            (studentRejections.get(student.name) || 0) + 1
          );
        }
      }
    });
  });

  let rejectedStudent = 'N/A';
  let maxRejections = 0;
  
  studentRejections.forEach((rejections, name) => {
    if (rejections > maxRejections) {
      maxRejections = rejections;
      rejectedStudent = name;
    }
  });

  return rejectedStudent;
}