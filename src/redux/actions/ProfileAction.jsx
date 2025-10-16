import { profileService } from "../../../service/ProfileService";
import { GET_PROFILE } from "../types/ProfileType";

// Action: Lấy thông tin profile
export const getProfileActionById = (id) => { // <-- Nhận vào một `id`
  return async (dispatch) => {
    try {
      // Gọi đến service và truyền `id` vào
      const result = await profileService.getProfileById(id); // Giả định bạn có hàm getProfileById(id) trong service

      if (result.status === 200) {
        // Không dispatch vào Redux store, chỉ trả về dữ liệu
        // để component tự xử lý, giống hệt getTeacherAction.
        return { success: true, data: result.data.data };
      }
    } catch (error) {
      console.log(`error fetching profile with id: ${id}`, error);
      return { success: false, error };
    }
  };
};