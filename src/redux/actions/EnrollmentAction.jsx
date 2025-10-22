/* eslint-disable react-refresh/only-export-components */
// eslint-disable-next-line react-refresh/only-export-components
import { enrollmentService } from "../../../service/EnrollmentService";
import { GET_COURSE_ENROLLMENT } from "../types/EnrollmentType";


export const getCourseEnrollmentAction = (class_id, semester_id) => {
  return async (dispatch) => {
    try {
      const result = await enrollmentService.getAllOpenCourses(class_id, semester_id);
      if (result.status === 200) {
        dispatch({
          type: GET_COURSE_ENROLLMENT,
          enrollments: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getCourseEnrollmentAction error:", error);
      return { success: false, error };
    }
  };
};

export const CreateCourseEnrollmentAction = (user_id, course_id) => {
  return async () => {
    try {
      const result = await enrollmentService.enrollment(user_id, course_id);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getCourseEnrollmentAction error:", error);
      return { success: false, error };
    }
  };
};

export const DeleteCourseEnrollmentAction = (user_id, register_id) => {
  return async () => {
    try {
      const result = await enrollmentService.deleteEnrollment(user_id, register_id);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getCourseEnrollmentAction error:", error);
      return { success: false, error };
    }
  };
};