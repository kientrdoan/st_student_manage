import { BaseService } from "./BaseService";

export class ClassService extends BaseService {
  constructor() {
    super();
  }

  getAllClass = () => {
    return this.get_token(`/students/classes`);
  };

}

export const classService = new ClassService();