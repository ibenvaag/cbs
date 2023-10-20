const http = require('http');

// URLen til serveren du vil måle RTT til
const serverUrl = 'http://64.226.86.113:3000';

// Funksjon for å sende en HTTP-forespørsel og måle RTT
async function pingServer() {
  const startTime = Date.now();

  try {
    // Send en HTTP GET-forespørsel til serveren
    await http.get(serverUrl, (response) => {
      const endTime = Date.now();
      const rtt = endTime - startTime;

      // Skriv ut RTT til konsollen
      console.log(`Server responded in ${rtt} ms`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Kjør pingen periodisk (for eksempel hvert sekund)
setInterval(pingServer, 1000);