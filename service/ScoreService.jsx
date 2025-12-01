import { BaseService } from "./BaseService";

export class ScoreService extends BaseService {
  constructor() {
    super();
  }

  getAllScores = (user_id) => {
    return this.get_token(`/students/scores/${user_id}`);
  };

}

export const scoreService = new ScoreService();