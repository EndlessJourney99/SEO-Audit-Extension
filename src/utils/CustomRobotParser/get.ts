// const get = require('simple-get');

const getRobots = (url: string, timeout: number) =>
    new Promise<string>((resolve, reject) => {
        fetch(url, { method: 'GET' })
            .then((val) => resolve(val.text().then((text) => text)))
            .catch((err) => reject(err));
    });

export default getRobots;
