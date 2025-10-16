import { BaseService } from "./BaseService";

export class ProfileService extends BaseService {
  constructor() {
    super();
  }

    getProfile = (id) => {
    return this.get_token(`/students/profile/${id}`);
    };

}

export const profileService = new ProfileService();