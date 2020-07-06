export const events = {
  events: {},
  on: function (type, cb) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(cb);
  },
  off: function (type, cb) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((fn) => fn !== cb);
  },
  dispatch: function ({ type, payload }) {
    if (!this.events[type]) return;
    this.events[type].forEach((fn) => fn(payload));
  },
};
