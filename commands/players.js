class Player {
  constructor(steamId) {
    this.steamId = steamId;
    this.name = null;
    this.status = null;
    this.game = null;
    this.lastSeen = null;

    // Track previous state to detect changes
    this.prevStatus = null;
  }

  update(steamData) {
    this.prevStatus = this.status;

    this.name = steamData.personaname;
    this.status = steamData.personastate;
    this.game = steamData.gameextrainfo || null;
    this.lastSeen = steamData.lastlogoff || null;
  }

  get hasStatusChanged() {
    return this.prevStatus !== null && this.prevStatus !== this.status;
  }
}

module.exports = Player;
