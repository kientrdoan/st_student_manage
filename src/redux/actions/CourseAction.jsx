/* eslint-disable no-unused-vars */

import { courseService } from "../../../service/CourseService";
import { GET_ALL_COURSE_BY_COURSE_ID, GET_ALL_COURSE_BY_STUDENT_SEMESTER } from "../types/CourseType";

export const getAllCourseByStudentAndSemesterAction = (student_id, semester_id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.getCourseByStudentAndSemester(student_id, semester_id);
      console.log("course", result)
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


export const getAllCourseByCourseIdAction = (course_id) => {
  return async (dispatch) => {
    try {
      const result = await courseService.getCourseByCourseId(course_id);
      console.log("course", result)
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_COURSE_BY_COURSE_ID,
          course_detail: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};