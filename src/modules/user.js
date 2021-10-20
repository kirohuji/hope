const module = "users";
export class User {
  constructor(user_id, name, node_id, remark, status, node_name) {
    this.user_id = user_id;
    this.node_id = node_id;
    this.name = name;
    this.remark = remark;
    this.status = status;
    this.node_name = node_name;
  }
}
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
