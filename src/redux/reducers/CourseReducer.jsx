import { GET_ALL_COURSE_BY_STUDENT_SEMESTER } from "../types/CourseType";

const stateDefault = {
  teacher_detail: {},
  courses: []
};

export const CourseReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_COURSE_BY_STUDENT_SEMESTER: {
      state.courses = action.courses;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};