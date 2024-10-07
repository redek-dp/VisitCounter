const https = require("https");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class ProfileView {
  constructor() {
    this.count = 0;
  }

  async viewProfile(url) {
    const trimmedUrl = url.trim();
    try {
      await this.fetchUrl(trimmedUrl);
      this.count++;
      console.log(`\x1b[1mBoosting: \x1b[32m+${this.count}\x1b[0m`);
    } catch (error) {
      console.error(`ERR VIEW PROFILE: ${error}`);
    }
  }

  fetchUrl(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            return reject(`Request failed with status: ${res.statusCode}`);
          }
          res.on("data", () => {});
          res.on("end", () => resolve());
        })
        .on("error", (err) => {
          reject(`Network error: ${err.message} (code: ${err.code})`);
        });
    });
  }
}

const profileView = new ProfileView();

rl.question("Enter GitHub username: ", (username) => {
  const url = `https://visitcount.itsvg.in/api?id=${username}&label=Profile%20Views&color=8&icon=8&pretty=true`;

  rl.question("Enter number of views: ", async (numViews) => {
    const startTime = Date.now();

    numViews = parseInt(numViews, 10);
    if (isNaN(numViews) || numViews <= 0) {
      console.log("Please enter a valid number of views.");
      rl.close();
      return;
    }

    const parallelRequests = 10;
    const tasks = Array.from({ length: numViews }, () => profileView.viewProfile(url));

    for (let i = 0; i < tasks.length; i += parallelRequests) {
      const chunk = tasks.slice(i, i + parallelRequests);
      await Promise.all(chunk);
    }

    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000;

    console.log(
      `Boosting completed in \x1b[32m${elapsedTime}s\x1b[0m! Your GitHub account has an extra \x1b[32m${numViews}\x1b[0m Views!`
    );
    rl.close();
  });
});
