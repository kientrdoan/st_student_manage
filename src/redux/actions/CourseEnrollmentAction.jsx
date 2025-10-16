import { courseEnrollmentService } from "../../../service/CourseEnrollmentService";
import { GET_COURSE_ENROLLMENT } from "../types/CourseEnrollmentType";
import { TOKEN } from "../../../utils/Config";
import { jwtDecode } from "jwt-decode";

export const getCourseEnrollmentAction = () => {
  return async (dispatch) => {
    try {
      // 🔹 Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN);
      if (!token) throw new Error("No token found");

      // 🔹 Giải mã token để lấy user_id
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      console.log("Course Enrollment Action - User ID:", userId);

      // 🔹 Gọi API lấy danh sách khóa học đã ghi danh của user
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