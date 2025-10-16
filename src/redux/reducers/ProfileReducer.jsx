import { GET_PROFILE } from "../types/ProfileType";

const stateDefault = {
  student_detail: {},
};

export const ProfileReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_PROFILE: {
      state.student_detail = action.student_detail;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};