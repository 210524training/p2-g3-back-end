import { IEntity } from '../../@types/trms/index.d';
import Repository from '../../repositories/generic/repository';

/**
 * Generic service that implements all the default repository operations (CRUD, get all items,
 * or get item by id).
 *
 * @author Dustin Diaz
 */
export default class Service<T extends IEntity, R extends Repository<T>> {
  constructor(
    protected repository: R,
  ) {}

  getAll(): Promise<T[]> {
    return this.repository.getAll();
  }

  getById(id: string): Promise<T | null> {
    return this.repository.getById(id);
  }

  add(item: T): Promise<boolean> {
    return this.repository.add(item);
  }

  update(item: T): Promise<boolean> {
    return this.repository.update(item);
  }

  delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
