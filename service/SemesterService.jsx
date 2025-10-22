import { BaseService } from "./BaseService";

export class SemesterService extends BaseService {
  constructor() {
    super();
  }

  getAllSemester = () => {
    return this.get(`/students/semesters`);
  };

}

export const semesterService = new SemesterService();