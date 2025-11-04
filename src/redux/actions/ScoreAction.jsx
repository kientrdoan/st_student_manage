import { scoreService } from "../../../service/ScoreService";
import { GET_ALL_SCORE } from "../types/ScoreType";


export const getAllScoreAction = (user_id) => {
  return async (dispatch) => {
    try {
      const result = await scoreService.getAllScores(user_id);
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_SCORE,
          scores: result.data.data

        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};