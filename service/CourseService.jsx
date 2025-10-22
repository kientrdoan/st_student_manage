import { BaseService } from "./BaseService";

export class CourseService extends BaseService {
  constructor() {
    super();
  }

  // Course đã đăng ký
  getCourseByStudentAndSemester = (student_id, semester_id) => {
    return this.get(`/students/enrollments/${student_id}/${semester_id}`);
  };
}

export const courseService = new CourseService();