import { BaseService } from "./BaseService";

export class ProfileService extends BaseService {
  constructor() {
    super();
  }

    getProfile = (id) => {
    return this.get_token(`/students/profile/${id}`); // <-- Sửa thành dấu backtick ` `
    };

}

export const profileService = new ProfileService();