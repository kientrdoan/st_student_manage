import { BaseService } from "./BaseService";

export class SubjectService extends BaseService {
  constructor() {
    super();
  }

  getAllSubject = (user_id) => {
    return this.get(`/students/subjects/${user_id}`);
  };

}

export const subjectService = new SubjectService();