class Team {
  constructor(name) {
    this.name = name;
    this.players = [];
  }

  addPlayer(steamId) {
    const Player = require("./players.js");
    const player = new Player(steamId);
    this.players.push(player);
    return player;
  }

  removePlayer(steamId) {
    this.players = this.players.filter((u) => u.steamId !== steamId);
  }

  getAllSteamIds() {
    return this.players.map((u) => u.steamId);
  }
}

module.exports = Team;
