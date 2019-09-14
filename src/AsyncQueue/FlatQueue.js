import asyncSleep from '../utils/asyncSleep';


export default class {
  tasks = new Set([]);

  /**
   * Добавление новой таски в очередь.
   * @param {Promise<any>} task 
   */
  addTaskToQueue(task, timeout = 0) {
    this.tasks.add(task);

    task
      .finally(() => {
        this.tasks.delete(task);
      });
  }

  /**
   * Ждём момента, когда все таски завершатся, в том числе добавленные в очередь после старта метода.
   * @returns Promise<void>
   */
  async waitAllTasksComplete() {
    const listOfTasks = [];
    const entries = this.tasks.values();

    this.tasks.forEach(task => {
      listOfTasks.push(task);
    });

    await Promise.all(entries);
    await asyncSleep(0);

    if (this.tasks.size > 0) {
      await this.waitAllTasksComplete();
    }

    return;
  }
};
