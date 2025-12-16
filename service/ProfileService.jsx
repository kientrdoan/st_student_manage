import { BaseService } from "./BaseService";

export class ProfileService extends BaseService {
  constructor() {
    super();
  }

    getProfile = (id) => {
    return this.get_token(`/students/profile/${id}`);
    };

    editInfoStudentByUserId = (id, payload) => {
    return this.put_token(`/students/profile/${id}`, payload)
  }

}

export const profileService = new ProfileService();