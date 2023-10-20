const http = require('http');
const startTime = process.hrtime();

// Definer serveradressen og portnummeret
const serverAddress = 'http://64.226.86.113';
const port = 3000;

// Lag en HTTP-forespørsel til serveren
const request = http.get(`${serverAddress}:${port}`, (response) => {
    const endTime = process.hrtime(startTime);
    const elapsedTimeInMilliseconds = endTime[0] * 1000 + endTime[1] / 1e6;
    
    console.log(`Server responded in ${elapsedTimeInMilliseconds} ms`);
});

// Håndter eventuelle feil
request.on('error', (error) => {
    console.error(`Error: ${error.message}`);
});

const pingInterval = 1000; // Tidsintervall for å sende Pinger-forespørsler (1 sekund)

function pingServer() {
    const pingStartTime = process.hrtime();
    const pingRequest = http.get(`${serverAddress}:${port}`, (response) => {
        const pingEndTime = process.hrtime(pingStartTime);
        const pingTimeInMilliseconds = pingEndTime[0] * 1000 + pingEndTime[1] / 1e6;

        console.log(`Round Trip Time (RTT): ${pingTimeInMilliseconds} ms`);
    });

    pingRequest.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
}

// Periodisk ping til serveren
setInterval(pingServer, pingInterval);
