export default class {
  keys = new Set([]);

  constructor({ queue, request }) {
    this.queue = queue;
    this.request = request;
  }

  addMessage(key) {
    this.keys.add(key);
  }

  async getValues() {
    const keysList = [];

    this.keys.forEach(key => {
      keysList.push(key);
    });

    await this.queue.waitAllTasksComplete();

    const result = await this.request(keysList);

    return result;
  }
}
