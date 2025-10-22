import { BaseService } from "./BaseService";

export class ClassService extends BaseService {
  constructor() {
    super();
  }

  getAllClass = () => {
    return this.get(`/students/classes`);
  };

}

export const classService = new ClassService();