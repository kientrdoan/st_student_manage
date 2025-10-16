import { BaseService } from "./BaseService";

/**
 * Service xử lý các API liên quan đến Course Enrollment
 */
export class CourseEnrollmentService extends BaseService {
  constructor() {
    super();
  }

  /**
   * 🔹 Lấy danh sách khóa học đã ghi danh của một user cụ thể
   * @param {number} userId - ID của user
   * @returns {Promise} - Danh sách course enrollments
   */
  getCourseEnrollment = (userId) => {
    return this.get_token(`/students/courses/enrollments/${userId}`);
  };

  /**
   * 🔹 Lấy tất cả các khóa học có sẵn để đăng ký
   * @returns {Promise} - Danh sách courses khả dụng
   */
  getAllAvailableCourses = (userId) => {
    return this.get_token(`/students/courses/enrollments/${userId}`);
    // Hoặc: return this.get_token(`/courses/available`);
  };

  /**
   * 🔹 Đăng ký một khóa học
   * @param {number} userId - ID của user
   * @param {number} courseId - ID của course muốn đăng ký
   * @returns {Promise} - Thông tin enrollment vừa tạo
   */
  enrollCourse = (userId, courseId) => {
    return this.post_token(`/course-enrollments`, {
      user_id: userId,
      course_id: courseId,
    });
  };

  /**
   * 🔹 Hủy đăng ký một khóa học
   * @param {number} enrollmentId - ID của enrollment muốn hủy
   * @returns {Promise} - Kết quả xóa
   */
  unenrollCourse = (enrollmentId) => {
    return this.delete_token(`/course-enrollments/${enrollmentId}`);
  };

  /**
   * 🔹 Lấy chi tiết một course enrollment
   * @param {number} enrollmentId - ID của enrollment
   * @returns {Promise} - Chi tiết enrollment
   */
  getCourseEnrollmentDetail = (enrollmentId) => {
    return this.get_token(`/course-enrollments/${enrollmentId}`);
  };

  /**
   * 🔹 Cập nhật thông tin một enrollment (optional)
   * @param {number} enrollmentId - ID của enrollment
   * @param {object} data - Dữ liệu cần cập nhật
   * @returns {Promise} - Enrollment đã cập nhật
   */
  updateCourseEnrollment = (enrollmentId, data) => {
    return this.put_token(`/course-enrollments/${enrollmentId}`, data);
  };

  /**
   * 🔹 Tìm kiếm courses theo keyword (optional)
   * @param {string} keyword - Từ khóa tìm kiếm
   * @returns {Promise} - Danh sách courses
   */
  searchCourses = (keyword) => {
    return this.get_token(`/courses/search?q=${keyword}`);
  };

  /**
   * 🔹 Lọc courses theo điều kiện (optional)
   * @param {object} filters - Điều kiện lọc (major, credit, teacher, etc.)
   * @returns {Promise} - Danh sách courses đã lọc
   */
  filterCourses = (filters) => {
    const params = new URLSearchParams(filters).toString();
    return this.get_token(`/courses?${params}`);
  };

  /**
   * 🔹 Kiểm tra xem user đã đăng ký course chưa (optional)
   * @param {number} userId - ID của user
   * @param {number} courseId - ID của course
   * @returns {Promise} - { enrolled: boolean }
   */
  checkEnrollmentStatus = (userId, courseId) => {
    return this.get_token(`/course-enrollments/check?user_id=${userId}&course_id=${courseId}`);
  };

  /**
   * 🔹 Lấy lịch học của user (optional)
   * @param {number} userId - ID của user
   * @returns {Promise} - Lịch học
   */
  getUserSchedule = (userId) => {
    return this.get_token(`/students/courses/schedule/${userId}`);
  };
}

// Export singleton instance
export const courseEnrollmentService = new CourseEnrollmentService();