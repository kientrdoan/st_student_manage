import { GET_ALL_SCORE } from "../types/ScoreType";

const stateDefault = {
  scores: [],
};

export const ScoreReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_ALL_SCORE: {
      state.scores = action.scores;
      return { ...state };
    }
    
    default:
      return { ...state };
  }
};