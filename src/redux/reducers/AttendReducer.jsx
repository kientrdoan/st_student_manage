import { GET_ATTEND_BY_STUDENT_AND_COURSE } from "../types/AttendType";


const stateDefault = {
  attends: [],
};

export const AttendReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ATTEND_BY_STUDENT_AND_COURSE: {
      state.attends = action.attends;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};