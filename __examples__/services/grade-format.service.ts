import gradeFormatRepository, { GradeFormatRepository } from '../repositories/grade.format.repository';
import GradeFormat from '../models/grade-format';
import Service from './generic/service';

export class GradeFormatService extends Service<GradeFormat, GradeFormatRepository> {
  constructor() {
    super(gradeFormatRepository);
  }
}

export default new GradeFormatService();
