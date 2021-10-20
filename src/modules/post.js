const module = "posts";
export class PostService {
  constructor(api) {
    this.makeUserService(api);
    this.module = module;
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  insert(target) {
    return this.api.post(`${this.module}/`, target);
  }
  findBooks(target) {
    return this.api.get(`${this.module}/findBooks`, target);
  }
}
