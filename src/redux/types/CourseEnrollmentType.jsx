// ======================================
// COURSE ENROLLMENT ACTION TYPES
// ======================================

// 🔹 Lấy danh sách môn học đã đăng ký của user
export const GET_COURSE_ENROLLMENT = "GET_COURSE_ENROLLMENT";

// 🔹 Lấy tất cả các môn học có sẵn để đăng ký
export const GET_ALL_AVAILABLE_COURSES = "GET_ALL_AVAILABLE_COURSES";

// 🔹 Đăng ký một môn học mới
export const ENROLL_COURSE = "ENROLL_COURSE";

// 🔹 Hủy đăng ký một môn học
export const UNENROLL_COURSE = "UNENROLL_COURSE";

// 🔹 Lấy chi tiết một course enrollment
export const GET_COURSE_ENROLLMENT_DETAIL = "GET_COURSE_ENROLLMENT_DETAIL";

// 🔹 Loading states (optional - nếu muốn quản lý loading trong reducer)
export const SET_COURSE_ENROLLMENT_LOADING = "SET_COURSE_ENROLLMENT_LOADING";

// 🔹 Error states (optional - nếu muốn quản lý error trong reducer)
export const SET_COURSE_ENROLLMENT_ERROR = "SET_COURSE_ENROLLMENT_ERROR";

// 🔹 Clear error (optional)
export const CLEAR_COURSE_ENROLLMENT_ERROR = "CLEAR_COURSE_ENROLLMENT_ERROR";