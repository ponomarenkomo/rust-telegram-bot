// const Team = require("../structures/team.js"); // adjust path

// class TeamManager {
//   constructor() {
//     this.teams = {}; // store team instances
//   }

//   getTeam(name) {
//     return this.teams[name] || null;
//   }

//   createTeam(name) {
//     if (!this.teams[name]) {
//       this.teams[name] = new Team(name); // must be a Team instance
//     }
//     return this.teams[name];
//   }

//   addPlayerToTeam(teamName, steamId) {
//     const team = this.createTeam(teamName);
//     this.teams[teamName].players.push(steamId);
//     return team;
//   }

//   getAllTeams() {
//     return Object.values(this.teams);
//   }
// }

// module.exports = TeamManager;

const Team = require("../structures/team.js");
const Player = require("../structures/players.js"); // <-- добавили

class TeamManager {
  constructor() {
    this.teams = {}; // { teamName: Team }
    this.players = {}; // { steamId: Player }
  }

  getTeam(name) {
    return this.teams[name] || null;
  }

  createTeam(name) {
    if (!this.teams[name]) {
      this.teams[name] = new Team(name);
    }
    return this.teams[name];
  }

  addPlayerToTeam(teamName, steamId) {
    const team = this.createTeam(teamName);

    // Создаем Player объект, если его нет
    let player = this.players[steamId];
    if (!player) {
      player = new Player(steamId);
      this.players[steamId] = player;
    }

    // Важно: добавить объект Player, а НЕ строку
    team.players.push(player);

    return team;
  }

  getAllTeams() {
    return Object.values(this.teams);
  }
}

module.exports = TeamManager;
