import { BaseService } from "./BaseService";

export class CourseService extends BaseService {
  constructor() {
    super();
  }

  // Course đã đăng ký
  getCourseByStudentAndSemester = (student_id, semester_id) => {
    return this.get_token(`/students/enrollments/${student_id}/${semester_id}`);
  };

  getCourseByCourseId = (course_id) => {
    return this.get_token(`/students/courses/${course_id}/`);
  };
}

export const courseService = new CourseService();