import { 
  GET_COURSE_ENROLLMENT, 
  GET_ALL_AVAILABLE_COURSES,
  ENROLL_COURSE,
  UNENROLL_COURSE,
  GET_COURSE_ENROLLMENT_DETAIL
} from "../types/CourseEnrollmentType";

const stateDefault = {
  course_enrollments: [], // Danh sách môn học đã đăng ký của user
  available_courses: [], // Danh sách tất cả môn học có sẵn để đăng ký
  course_enrollment_detail: {}, // Chi tiết một enrollment
};

export const CourseEnrollmentReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_COURSE_ENROLLMENT: {
      return { 
        ...state,
        course_enrollments: action.course_enrollments 
      };
    }

    case GET_ALL_AVAILABLE_COURSES: {
      return { 
        ...state,
        available_courses: action.available_courses 
      };
    }

    case ENROLL_COURSE: {
      // Thêm môn học vừa đăng ký vào danh sách course_enrollments
      const newEnrollments = [...state.course_enrollments, action.enrolled_course];
      return { 
        ...state,
        course_enrollments: newEnrollments
      };
    }

    case UNENROLL_COURSE: {
      // Xóa môn học đã hủy khỏi danh sách course_enrollments
      const filteredEnrollments = state.course_enrollments.filter(
        enrollment => enrollment.id !== action.enrollment_id
      );
      return { 
        ...state,
        course_enrollments: filteredEnrollments
      };
    }

    case GET_COURSE_ENROLLMENT_DETAIL: {
      return { 
        ...state,
        course_enrollment_detail: action.course_enrollment_detail 
      };
    }

    default:
      return state;
  }
};