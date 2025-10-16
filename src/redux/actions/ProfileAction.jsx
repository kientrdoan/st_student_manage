/* eslint-disable no-unused-vars */

import { profileService } from "../../../service/ProfileService";
import { GET_PROFILE } from "../types/ProfileType";

export const getDetailStudentByUserIdAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await profileService.getProfile(id);
      if (result.status === 200) {
        dispatch({
          type: GET_PROFILE,
          student_detail: result.data.data
        });
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};

export const editInfoStudentByUserIdAction = (id) => {
  return async (dispatch) => {
    try {
      const result = await profileService.editInfoTeacherByUserId(id);
      if (result.status === 200) {
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log("error", error);
      return { success: false, error };
    }
  };
};