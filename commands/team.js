class Team {
  constructor(name) {
    this.name = name;
    this.users = [];
  }

  addUser(steamId) {
    const User = require("./players.js");
    const user = new User(steamId);
    this.users.push(user);
    return user;
  }

  // addUser(steamId) {
  //   this.users.push(steamId);
  // }

  removeUser(steamId) {
    this.users = this.users.filter((u) => u.steamId !== steamId);
  }

  getAllSteamIds() {
    return this.users.map((u) => u.steamId);
  }
}

module.exports = Team;
