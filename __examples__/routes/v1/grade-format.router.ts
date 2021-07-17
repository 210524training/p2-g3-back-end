import { Router } from 'express';
import GradeFormat from '../../models/grade-format';
import { GradeFormatRepository } from '../../repositories/grade.format.repository';
import gradeFormatService, { GradeFormatService } from '../../services/grade-format.service';
import GenericRouter, { ACCESS } from './generic/router';

const router = Router();
const genericRouter = new GenericRouter<
  GradeFormat, GradeFormatRepository, GradeFormatService
>(gradeFormatService, 'GradeFormat');

router.get('/', genericRouter.getAll(ACCESS.LIMIT));
router.get('/:id', genericRouter.getById(ACCESS.LIMIT));
router.post('/', genericRouter.addItem());
router.put('/', genericRouter.updateItem());
router.delete('/:id', genericRouter.deleteItem());

export default router;
