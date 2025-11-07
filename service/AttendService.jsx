import { BaseService } from "./BaseService";

export class AttendService extends BaseService {
  constructor() {
    super();
  }

  getAttendByStudentAndCourse = (user_id, course_id) => {
    return this.get(`/students/attends/${user_id}/${course_id}`);
  };

}

export const attendService = new AttendService();