import { BaseService } from "./BaseService";

export class EnrollmentService extends BaseService {
  constructor() {
    super();
  }

  getAllOpenCourses = (class_id, semester_id) => {
    return this.get_token(`/students/courses/${class_id}/${semester_id}`);
  };

  enrollment = (user_id, course_id) => {
    return this.post_token(`/students/create-enrollments/${user_id}/${course_id}`)
  };

  deleteEnrollment = (user_id, register_id) => {
    return this.delete_token(`/students/delete-enrollments/${user_id}/${register_id}`)
  }
}

export const enrollmentService = new EnrollmentService();