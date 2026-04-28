/**
 * Base Entity Model
 * Implements Encapsulation & Inheritance
 * All domain models extend this base class
 */
export abstract class BaseEntityModel {
  protected _id: string;
  protected _created_at: string;
  protected _updated_at: string;
  protected _deleted_at?: string | null;

  constructor(data: any) {
    this._id = data.id;
    this._created_at = data.created_at;
    this._updated_at = data.updated_at;
    this._deleted_at = data.deleted_at;
  }

  // Getters (Encapsulation)
  get id(): string {
    return this._id;
  }

  get createdAt(): string {
    return this._created_at;
  }

  get updatedAt(): string {
    return this._updated_at;
  }

  get deletedAt(): string | null | undefined {
    return this._deleted_at;
  }

  get isDeleted(): boolean {
    return this._deleted_at !== null && this._deleted_at !== undefined;
  }

  // Abstract method - must be implemented by child classes
  abstract toJSON(): any;

  // Common method for all entities
  isNew(): boolean {
    return !this._id || this._id === '';
  }
}
