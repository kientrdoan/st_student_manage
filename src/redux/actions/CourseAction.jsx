/* eslint-disable no-unused-vars */

import { courseService } from "../../../service/CourseService";
import { GET_ALL_COURSE_BY_STUDENT_SEMESTER } from "../types/CourseType";

export const getAllCourseByStudentAndSemesterAction = (student_id, semester_id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.getCourseByStudentAndSemester(student_id, semester_id);
      console.log("data", result)
      console.log(result)
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_COURSE_BY_STUDENT_SEMESTER,
          courses: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};