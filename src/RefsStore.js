// @format
export default class RefsStore {
  store(name, value) {
    this[name] = value;
  }
}
