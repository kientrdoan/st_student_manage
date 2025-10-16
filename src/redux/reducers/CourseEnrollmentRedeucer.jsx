import { GET_COURSE_ENROLLMENT } from "../types/CourseEnrollmentType";

const stateDefault = {
  course_enrollments: {},
  course_enrollment_detail: {},
};

export const CourseEnrollmentReducer = (
  state = { course_enrollments: [], course_enrollment_detail: {} },
  action
) => {
  switch (action.type) {
    case GET_COURSE_ENROLLMENT:
      return { ...state, course_enrollments: action.course_enrollments };
    default:
      return state;
  }
};