const bcrypt = require("bcrypt");

class Auth {
  constructor(saltRounds, data) {
    this.saltRounds = saltRounds;
    this.data = data;
    this.hash = "";
    this.genHash();
  }

  getSalt() {
    return bcrypt.genSalt(this.saltRounds);
  }

  genHash() {
    const salt = this.getSalt().then((saltGenerated) => {
      bcrypt.hash(this.data, saltGenerated, (err, result) => {
        if (err) {
          throw err;
        } else {
          this.hash = result;
          return this.hash;
        }
      });
    });
  }

  chechPass(hash) {
    bcrypt.compare(this.data, this.hash, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        return true;
      }
    });
  }

  syncGenHash() {
    const dataToHash = bcrypt.hashSync(this.data, this.saltRounds);
    return dataToHash;
  }
}

module.exports = { Auth };
