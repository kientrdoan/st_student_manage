import { BaseService } from "./BaseService";

export class SubjectService extends BaseService {
  constructor() {
    super();
  }

  getAllSubject = () => {
    return this.get("/students/subjects");
  };

}

export const subjectService = new SubjectService();