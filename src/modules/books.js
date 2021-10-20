const module = "books";
export class BooksService {
  constructor(api) {
    this.makeUserService(api);
    this.module = module;
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  findBooksWithPosts() {
    return this.api.get(`${this.module}/findBooksWithPosts`);
  }
  findOne(target) {
    return this.api.get(`${this.module}/${target}`);
  }
  getBookFile(target) {
    return this.api.get(`${this.module}/getBookFile/${target}`);
  }
}
