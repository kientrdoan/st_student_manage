import { GET_ALL_COURSE_BY_COURSE_ID, GET_ALL_COURSE_BY_STUDENT_SEMESTER } from "../types/CourseType";

const stateDefault = {
  teacher_detail: {},
  courses: [],
  course_detail: {},
};

export const CourseReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_COURSE_BY_STUDENT_SEMESTER: {
      state.courses = action.courses;
      return { ...state };
    }

    case GET_ALL_COURSE_BY_COURSE_ID: {
      state.course_detail = action.course_detail;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};