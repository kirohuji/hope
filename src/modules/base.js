export class Service {
  constructor(options) {
    for (const name in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }
  }
  makeUserService({ api }) {
    this.api = api;
    return this;
  }
  findOne(target) {
    return this.api.get(`${this.module}`, target);
  }
  find(target) {
    return this.api.get(`${this.module}`, target);
  }
}
