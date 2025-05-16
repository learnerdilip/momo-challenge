interface RepositoryRecord {
  id: number;
  [key: string]: any;
}

export interface Repository<T extends RepositoryRecord> {
  list(filter?: (record: T) => boolean): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  read(id: number): Promise<T>;
  update(id: number, data: Omit<T, "id">): Promise<T>;
  delete(id: number): Promise<void>;
}

export interface WithoutIdRepository<T extends Omit<RepositoryRecord, "id">> {
  list(filter?: (record: T) => boolean): Promise<T[]>;
  create(data: T): Promise<T>;
  read(id: number): Promise<T>;
  update(id: number, data: T): Promise<T>;
  delete(id: number): Promise<void>;
}
