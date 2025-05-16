import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from 'mongoose';
import Survey from '../models/Survey';
import Question from '../models/Question';
import Student from '../models/Student';
import { AsyncRequestHandler } from '../types/types';
import crypto from 'crypto'
import { StudentResponse, PopulatedQuestion, SurveyResultsData } from '../types/survey-result';
import { IQuestion } from '../types/question';
import { IStudent } from '../types/student';

export const getTeacherSurveys: AsyncRequestHandler = async (req, res, next) => {
  try {
    const surveys = await Survey.find({ teacher: req.user._id })
      .populate('questions')
      .populate('students');
    res.json({ success: true, data: surveys });
  } catch (error) {
    next(error);
  }
};

export const getSurveyResults: AsyncRequestHandler = async (req, res, next) => {
    try {
        const survey = await Survey.findById(req.params.id)
            .populate<{ students: StudentResponse[] }>({
                path: 'students',
                select: 'name hasCompleted responses'
            })
            .populate<{ questions: PopulatedQuestion[] }>({
                path: 'questions',
                select: 'content type category'
            })
            .lean();

        if (!survey) {
            throw Error('Survey not found');
        }

        // Calculate completion rate
        const completedCount = survey.students.filter(s => s.hasCompleted).length;
        const completionRate = Math.round((completedCount / survey.students.length) * 100);

        // Process question results
        const results = survey.questions.map(question => {
            // Get all responses for this question
            const allResponses = survey.students.flatMap(student => 
                student.responses
                    .filter(r => r.questionId.toString() === question._id.toString())
                    .flatMap(r => r.selectedStudents)
            );

            // Count votes per student
            const responseCounts = allResponses.reduce((acc: Record<string, number>, studentId: string) => {
                acc[studentId] = (acc[studentId] || 0) + 1;
                return acc;
            }, {});

            const totalResponses = Object.values(responseCounts).reduce((sum: number, count: number) => sum + count, 0);

            return {
                questionId: question._id,
                questionContent: question.content,
                responses: Object.entries(responseCounts).map(([studentId, count]) => {
                    const student = survey.students.find(s => s._id.toString() === studentId);
                    return {
                        name: student?.name || 'Unknown',
                        count: count as number,
                        percentage: totalResponses > 0 ? Math.round((count as number / totalResponses) * 100) : 0
                    };
                }).sort((a, b) => b.count - a.count)
            };
        });

        const responseData: SurveyResultsData = {
            survey: {
                _id: survey._id.toString(),
                title: survey.title,
                description: survey.description,
                students: survey.students.map(s => ({
                    ...s,
                    _id: s._id.toString(),
                    responses: s.responses.map(r => ({
                        questionId: r.questionId.toString(),
                        selectedStudents: r.selectedStudents.map(id => id.toString())
                    }))
                }))
            },
            results,
            completionRate
        };

        res.status(200).json({ 
            success: true, 
            data: responseData
        });
    } catch (error) {
        next(error);
    }
};

export const createSurvey: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { title, description, class: className, questions } = req.body;

    const survey = await Survey.create({
      title,
      description,
      class: className,
      teacher: req.user.id,
      questions, // Store whatever IDs are sent
      status: 'draft'
    });

    res.status(201).json({ 
      success: true, 
      data: survey 
    });
  } catch (error) {
    next(error);
  }
};

export const getSurveyForStudent: AsyncRequestHandler = async (req, res, next) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate<{
        questions: IQuestion[];
        students: IStudent[];
      }>({
        path: 'questions students',
        select: 'name content type category hasCompleted'
      })
      .lean();

    if (!survey) {
      throw Error("Survey not found");
    }

    if (survey.status !== 'active') {
      throw Error("Survey is not active");
    }

    // TypeScript now knows survey.students is IStudent[]
    const activeStudents = survey.students.filter(
      student => !student.hasCompleted
    );

    res.status(200).json({ 
      success: true, 
      data: {
        questions: survey.questions,
        students: activeStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitSurvey: AsyncRequestHandler = async (req, res) => {
  try {
    const { surveyId, responses } = req.body;
    const studentId = req.user.id; // From JWT

    // 1. Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      throw Error("Student not found");
    }

    // 2. Verify the survey exists
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      throw Error("Student not found");
    }

    // 3. Save responses
    student.responses = responses.map((r: any) => ({
      questionId: r.questionId,
      selectedStudents: r.selectedStudents
    }));
    student.hasCompleted = true;
    await student.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Submission failed',
      error: (error as Error).message 
    });
  }
};


export const getQuestions: AsyncRequestHandler = async (req, res, next) => {
  try {
    const questions = await Question.find({}).lean(); // Use lean() for plain JS objects
    const questionsWithId = questions.map(q => ({
      ...q,
      id: q._id.toString() // Explicitly include the ID
    }));
    res.status(200).json({ success: true, data: questionsWithId });
  } catch (error) {
    next(error);
  }
};

// Update the generateStudentHashes controller to be survey-specific
export const generateStudentHashes: AsyncRequestHandler = async (req, res, next) => {
  try {
    const { studentNames } = req.body;
    const surveyId = req.params.id;
    console.log('kur kapan')
    
    // Delete existing students for this survey
    await Student.deleteMany({ survey: surveyId });

    // Get survey to verify it exists and belongs to teacher
    const survey = await Survey.findOne({
      _id: surveyId,
      teacher: req.user.id
    });

    if (!survey) {
      throw Error('Survey not found or not owned by teacher')
    }

    // Type the hashes array explicitly
    const hashes: Array<{name: string; hash: string; _id?: Types.ObjectId}> = await Promise.all(
      studentNames.map(async (name: string) => {
        const hash = crypto.randomBytes(8).toString('hex');
        const student = new Student({
          name,
          hash,
          survey: surveyId,
          class: survey.class, // Now safe to access since we checked survey exists
          hasCompleted: false
        });
        await student.save();
        return { 
          name, 
          hash,
          _id: student._id // Include the _id for survey reference
        };
      })
    );

    // Update survey with student references
    survey.students = hashes.map(h => h._id).filter((id): id is Types.ObjectId => !!id);
    await survey.save();

    // Return only name and hash to frontend
    const responseData = hashes.map(({ name, hash }) => ({ name, hash }));
    
    res.status(200).json({ 
      success: true, 
      data: responseData 
    });
  } catch (error) {
    next(error);
  }
};

// survey.controller.ts
export const updateSurvey: AsyncRequestHandler = async (req, res, next) => {
  try {
    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      { status: 'active', students: req.body.students },
      { new: true }
    );
    if (!survey) throw new Error('Survey not found');
    res.json({ success: true, data: survey });
  } catch (error) {
    next(error);
  }
};

export const activateSurvey: AsyncRequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id } = req.params;
    const { students: studentHashes } = req.body;

    // 1. Find all students by their hashes (within the transaction)
    const students = await Student.find(
      { 
        hash: { $in: studentHashes },
        survey: id 
      },
      null,
      { session } // Important: pass the session
    ).select('_id');

    if (students.length !== studentHashes.length) {
      const invalidHashes = studentHashes.filter((hash: string) => !students.some(s => s.hash === hash));
      throw new Error(`Invalid hashes: ${invalidHashes.join(', ')}`);
    }

    // 2. Update the survey (within the same transaction)
    const survey = await Survey.findOneAndUpdate(
      { _id: id, teacher: req.user.id },
      { 
        status: 'active',
        students: students.map(s => s._id)
      },
      { 
        new: true,
        session // Important: pass the session
      }
    );

    if (!survey) {
      throw new Error('Survey not found or not owned by teacher');
    }

    // Commit the transaction if everything succeeded
    await session.commitTransaction();
    
    res.status(200).json({ success: true, data: survey });
  } catch (error) {
    // Rollback if any operation fails
    await session.abortTransaction();
    next(error);
  } finally {
    // End the session regardless of success/failure
    session.endSession();
  }
};