const module = "users"
export class UserService {
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
}
