import GradeFormat from '../models/grade-format';
import Repository from './generic/repository';
import { TableName, GradeFormatEntityName } from '../dynamo/consts';

export class GradeFormatRepository extends Repository<GradeFormat> {
  constructor() {
    super(
      TableName,
      GradeFormatEntityName,
      'id, gradeFormat, passingGrade, description',
      (o) => new GradeFormat(
        o.gradeFormat,
        o.passingGrade,
        o.description,
        o.id,
      ),
    );
  }
}

export default new GradeFormatRepository();
