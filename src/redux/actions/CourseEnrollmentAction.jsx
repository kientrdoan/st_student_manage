import { courseEnrollmentService } from "../../../service/CourseEnrollmentService";
import { 
  GET_COURSE_ENROLLMENT, 
  GET_ALL_AVAILABLE_COURSES,
  ENROLL_COURSE,
  UNENROLL_COURSE,
  GET_COURSE_ENROLLMENT_DETAIL
} from "../types/CourseEnrollmentType";
import { TOKEN } from "../../../utils/Config";
import { jwtDecode } from "jwt-decode";

// 🔹 Lấy danh sách khóa học đã ghi danh của user
export const getCourseEnrollmentAction = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      console.log("Course Enrollment Action - User ID:", userId);

      const result = await courseEnrollmentService.getCourseEnrollment(userId);

      if (result.status === 200) {
        dispatch({
          type: GET_COURSE_ENROLLMENT,
          course_enrollments: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getCourseEnrollmentAction error:", error);
      return { success: false, error };
    }
  };
};

// 🔹 Lấy tất cả các khóa học có sẵn để đăng ký (không cần userId)
export const getAllAvailableCoursesAction = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      const result = await courseEnrollmentService.getAllAvailableCourses(userId);

      if (result.status === 200) {
        dispatch({
          type: GET_ALL_AVAILABLE_COURSES,
          available_courses: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getAllAvailableCoursesAction error:", error);
      return { success: false, error };
    }
  };
};

// 🔹 Đăng ký một khóa học
export const enrollCourseAction = (courseId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(TOKEN);
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const userId = decoded.user_id;

      const result = await courseEnrollmentService.enrollCourse(userId, courseId);

      if (result.status === 200 || result.status === 201) {
        dispatch({
          type: ENROLL_COURSE,
          enrolled_course: result.data.data,
        });
        return { success: true, data: result.data.data, message: "Đăng ký môn học thành công!" };
      }
    } catch (error) {
      console.log("enrollCourseAction error:", error);
      const errorMessage = error.response?.data?.message || "Đăng ký môn học thất bại!";
      return { success: false, error, message: errorMessage };
    }
  };
};

// 🔹 Hủy đăng ký một khóa học
export const unenrollCourseAction = (enrollmentId) => {
  return async (dispatch) => {
    try {
      const result = await courseEnrollmentService.unenrollCourse(enrollmentId);

      if (result.status === 200 || result.status === 204) {
        dispatch({
          type: UNENROLL_COURSE,
          enrollment_id: enrollmentId,
        });
        return { success: true, message: "Hủy đăng ký môn học thành công!" };
      }
    } catch (error) {
      console.log("unenrollCourseAction error:", error);
      const errorMessage = error.response?.data?.message || "Hủy đăng ký môn học thất bại!";
      return { success: false, error, message: errorMessage };
    }
  };
};

// 🔹 Lấy chi tiết một course enrollment
export const getCourseEnrollmentDetailAction = (enrollmentId) => {
  return async (dispatch) => {
    try {
      const result = await courseEnrollmentService.getCourseEnrollmentDetail(enrollmentId);

      if (result.status === 200) {
        dispatch({
          type: GET_COURSE_ENROLLMENT_DETAIL,
          course_enrollment_detail: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("getCourseEnrollmentDetailAction error:", error);
      return { success: false, error };
    }
  };
};