const https = require('https');

module.exports = (client) => {
    client.downloadImage = async (url) => {
        return new Promise((resolve, reject) => {
        https.get(url, response => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download image: ${response.statusCode}`));
                }
                const data = [];
                
                response.on('data', chunk => {
                    data.push(chunk);
                });

                response.on('end', () => {
                    resolve(Buffer.concat(data));
                });
            }).on('error', reject);
        });
    }
}