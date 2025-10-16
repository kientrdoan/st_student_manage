import { BaseService } from "./BaseService";

export class CourseEnrollmentService extends BaseService {
  constructor() {
    super();
  }

    getProfile = (id) => {
    return this.get_token(`/students/courses/enrollments/${id}`); // <-- Sửa thành dấu backtick ` `
    };

}

export const courseEnrollmentService = new CourseEnrollmentService();