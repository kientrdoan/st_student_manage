import { BaseService } from "./BaseService";

export class AttendService extends BaseService {
  constructor() {
    super();
  }

  getAttendByStudentAndCourse = (user_id, course_id) => {
    return this.get_token(`/students/attends/${user_id}/${course_id}`);
  };

  attend = (payload) => {
    return this.post_token(`/admins/attendance/request`, payload);
  };

}

export const attendService = new AttendService();