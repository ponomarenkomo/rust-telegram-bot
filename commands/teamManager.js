const Team = require("./team.js"); // adjust path

class TeamManager {
  constructor() {
    this.teams = {}; // store team instances
  }

  getTeam(name) {
    return this.teams[name] || null;
  }

  createTeam(name) {
    if (!this.teams[name]) {
      this.teams[name] = new Team(name); // must be a Team instance
    }
    return this.teams[name];
  }

  addUserToTeam(teamName, steamId) {
    const team = this.createTeam(teamName); // ensures team exists
    team.addUser(steamId);
    return team;
  }

  getAllTeams() {
    return Object.values(this.teams);
  }
}

module.exports = TeamManager;
