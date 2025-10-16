/* eslint-disable no-unused-vars */

import { subjectService } from "../../../service/SubjectService";
import { GET_ALL_SUBJECT } from "../types/SubjectType";



export const getAllSubjectAction = () => {
  return async (dispatch) => {
    try {
      const result = await subjectService.getAllSubject();
      if (result.status === 200) {
        dispatch({
          type: GET_ALL_SUBJECT,
          subjects: result.data.data,
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};