export default class TimerSystem {
  #timers = new Map();
  #intervals = new Map();

  createTimer = (name, delay, callback) => {
    this.#timers.set(name, {
      callback,
      delay,
      startTime: Date.now(),
      pauseTime: null,
      isRunning: true,
      timeoutId: setTimeout(callback, delay),
    });
  }

  createInteval = (name, delay, callback) => {
    this.#intervals.set(name, {
      callback,
      delay,
      intervalId: setInterval(callback, delay),
    });
  }

  pauseTimer = name => {
    const timer = this.#timers.get(name);

    if (!timer.isRunning) return;

    timer.pauseTime = Date.now();

    clearTimeout(timer.timeoutId);
  }

  resumeTimer = name => {
    const timer = this.#timers.get(name);

    if (timer.isRunning) return;

    timer.timeoutId = setTimeout(timer.callback, timer.delay - (timer.pauseTime - timer.startTime));
  }
}
