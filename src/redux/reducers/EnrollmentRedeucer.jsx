import { GET_COURSE_ENROLLMENT } from "../types/EnrollmentType";

const stateDefault = {
  enrollments: [],
  course_enrollment_detail: {},
};

export const EnrollmentReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_COURSE_ENROLLMENT:
      state.enrollments = action.enrollments
      return { ...state };
    default:
      return state;
  }
};