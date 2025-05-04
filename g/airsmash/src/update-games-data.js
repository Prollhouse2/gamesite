const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('---- ' + path.basename(__filename) + '\n');

/*
 *  see https://github.com/airmash-refugees/airmash-games/blob/master/README.md for file format details
 */

const baseUrl = 'https://raw.githubusercontent.com/airmash-refugees/airmash-games/master/';
const regionsUrl = baseUrl + 'regions.txt'
const gamesUrl = baseUrl + 'games.txt'

const gamesDataJsPath = path.join(__dirname, 'js', 'GamesData.js');

const options = {
    headers: {
        'User-Agent': 'airmash-refugees/airmash-frontend build'
    }
};

function download(url, callback) {
    https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', (e) => {
            if (e) throw e;
            callback(data);
        });
    });
}

let data = [];

console.log(regionsUrl + ':');
download(regionsUrl, (d) => {
    console.log(d);
    regionstxt = d.split('\n');

    console.log(gamesUrl + ':');
    download(gamesUrl, (d) => {
        console.log(d);
        gamestxt = d.split('\n');

        for (let region of regionstxt) {
            region = region.split('|');
            if (region.length < 2) {
                continue;
            }

            let games = [];

            data.push({
                name: region[1],
                id: region[0],
                games
            });

            for (let game of gamestxt) {
                game = game.split('|');

                if (game[0] == region[0]) {
                    games.push({
                        type: game[1],
                        id: game[2],
                        name: game[3],
                        nameShort: game[4],
                        host: game[5],
                        path: game[6]
                    });
                }
            }
        }

        data = JSON.stringify(data);

        const js = 'export const defaultGamesData = ' + data + ';'

        console.log(gamesDataJsPath + ':');
        console.log(js);

        fs.writeFileSync(gamesDataJsPath, js);
    });
});
