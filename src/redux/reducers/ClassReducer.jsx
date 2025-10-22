import { GET_ALL_CLASS } from "../types/ClassType";

const stateDefault = {
  classes: [],
};

export const ClassReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_CLASS: {
      state.classes = action.classes;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};