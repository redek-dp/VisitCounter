const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class ProfileViewer {
    constructor() {
        this.counter = 0;
    }

    async viewProfile(url) {
        const trimmedUrl = url.trim();
        await this.get(trimmedUrl);
        this.counter++;
        console.log(`\x1b[1mConnecting!, Sending Boost: \x1b[32m+${this.counter}\x1b[0m`);
    }

    getCounter() {
        return this.counter;
    }

    get(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    return reject(`Request failed with status code: ${res.statusCode}`);
                }
                res.on('data', () => {});
                res.on('end', resolve);
            }).on('error', reject);
        });
    }

    async viewProfilesInBatch(url, batchSize) {
        const promises = [];
        for (let i = 0; i < batchSize; i++) {
            promises.push(this.viewProfile(url));
        }
        await Promise.all(promises);
    }
}

const profileViewer = new ProfileViewer();

rl.question('Enter GitHub Username: ', (username) => {
    const url = `https://profile-counter.glitch.me/${username}count.svg`;

    rl.question('Enter number of View: ', async (views) => {
        const timerStart = Date.now();

        const batchSize = 10; 
        const parallelBatches = 4; 
        const totalBatches = Math.ceil(views / batchSize);
        
        for (let i = 0; i < totalBatches; i += parallelBatches) {
            const currentBatch = [];
            for (let j = 0; j < parallelBatches && (i + j) < totalBatches; j++) {
                currentBatch.push(profileViewer.viewProfilesInBatch(url, batchSize));
            }
            await Promise.all(currentBatch);
        }

        const timerStop = Date.now();
        const timeElapsed = (timerStop - timerStart) / 1000;
        console.log(`Completed boosting in \x1b[32m${timeElapsed}s\x1b[0m! ${github} GitHub account has now an extra \x1b[32m${views}\x1b[0m Views!`);
        rl.close();
    });
});
