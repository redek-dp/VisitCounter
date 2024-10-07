const https = require('https');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
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
            https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    return reject(`Req failed with sts: ${res.statusCode}`);
                }
                res.on('data', () => {}); 
                res.on('end', resolve);
            }).on('error', reject);
        });
    }
}

const profileView = new ProfileView();

rl.question('Enter github username: ', (username) => {
    const url = `https://visitcount.itsvg.in/api?id=${username}&label=Profile%20Views&color=8&icon=8&pretty=true`;
    
    rl.question('Enter number of view: ', async (numViews) => {
        const startTime = Date.now();

        const requests = [];
        for (let i = 0; i < numViews; i++) {
            requests.push(profileView.viewProfile(url));
        }

        await Promise.all(requests);
        const endTime = Date.now();

        const waktu = (endTime - startTime) / 1000; 

        console.log(`Boosting completed in \x1b[32m${waktu}s\x1b[0m! Your GitHub account has an extra \x1b[32m${numViews}\x1b[0m Views!`);
        rl.close();
    });
});
