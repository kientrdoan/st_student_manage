/* eslint-disable no-unused-vars */

import { attendService } from "../../../service/AttendService";
import { GET_ATTEND_BY_STUDENT_AND_COURSE } from "../types/AttendType";


export const getAttendByStudentAndCourseAction = (user_id, course_id) => {
  return async (dispatch) => {
    try {
      const result = await attendService.getAttendByStudentAndCourse(user_id, course_id);
      if (result.status === 200) {
        dispatch({
          type: GET_ATTEND_BY_STUDENT_AND_COURSE,
          attends: result.data.data

        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};