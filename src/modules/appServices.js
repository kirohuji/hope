const module = "services";
export class AppServicesService {
  constructor(api) {
    this.makeUserService(api);
    this.module = module;
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  user(target) {
    return this.api.get(`${this.module}/user`, target);
  }
}
