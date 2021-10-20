const module = "";
export class AuthService {
  constructor(api) {
    this.makeUserService(api);
    this.module = module;
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  // @flow
  login(target) {
    return this.api.post(`${this.module}/login`, target);
  }
  logout() {
    return this.api.post(`${this.module}/logout`);
  }
}
