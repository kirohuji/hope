const module = "notes";
export class NotesService {
  constructor(api) {
    this.makeUserService(api);
    this.module = module;
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  find() {
    return this.api.get(`${this.module}`);
  }
  findOne(target) {
    return this.api.get(`${this.module}/${target}`);
  }
  save(target) {
    if (target._id) {
      return this.api.patch(`${this.module}/${target._id}`, target);
    }
    return this.api.post(`${this.module}`, target);
  }
  getNoteByBookIdWithUserId({ userId, bookId }) {
    return this.api.get(
      `${this.module}/getNoteByBookIdWithUserId/${userId}/${bookId}`
    );
  }
}
