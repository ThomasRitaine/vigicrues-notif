import nodemailer from 'nodemailer';

// Read environment variables
const threshold = parseFloat(process.env.THRESHOLD);
const checkInterval = parseInt(process.env.CHECK_INTERVAL, 10) * 60 * 1000; // Convert minutes to milliseconds
const pushoverEmails = process.env.PUSHOVER_EMAILS.split(',');
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT, 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

// URL for fetching the JSONP data
const url = 'https://www.vigicrues.gouv.fr/services/observations.json/index.php?CdStationHydro=X300101001&GrdSerie=Q&FormatSortie=simple&callback=jQuery112008376741977901722_1717013615775&_=1717013615777';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: true, // Use SSL/TLS
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

let lastAlertTime = 0;
let isFloodActive = false;

/**
 * Sends a notification email to all configured email addresses.
 *
 * @param {string} subject - The subject of the email.
 * @param {string} message - The message body of the email.
 */
async function sendNotification(subject, message) {
  const mailOptions = {
    from: smtpUser,
    to: pushoverEmails,
    subject: subject,
    text: message
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent!');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

/**
 * Fetches the data from the URL, parses the JSONP response, and checks if the latest value exceeds the threshold.
 * Sends notifications based on the threshold conditions.
 */
async function fetchDataAndCheck() {
  try {
    // Fetch the data from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const text = await response.text();

    // Extract JSONP callback content
    const jsonpCallbackName = text.match(/^(.*?)(?=\()/)[0];
    const jsonpData = text.substring(jsonpCallbackName.length + 1, text.length - 1);

    // Parse JSONP data
    const jsonData = JSON.parse(jsonpData);

    // Extract the latest value from the parsed JSON
    const latestValue = jsonData.Serie.ObssHydro[jsonData.Serie.ObssHydro.length - 1][1];

    const now = Date.now();
    const floodAlertInterval = 60 * 60 * 1000; // 1 hour

    if (latestValue > threshold) {
      if (!isFloodActive || (now - lastAlertTime) > floodAlertInterval) {
        await sendNotification(
          `VigiCrues [CRUE]: Débit ${latestValue} m³/s`,
          `Le débit a dépassé ${threshold} m³/s. Restez prudent.`
        );
        lastAlertTime = now;
        isFloodActive = true;
      }
    } else {
      console.log(
        `${new Date().toISOString()} - Current value: ${latestValue} m³/s is below the threshold.`
      );
      if (isFloodActive) {
        await sendNotification(
          `VigiCrues [NORMAL]: Débit ${latestValue} m³/s`,
          `Le débit est revenu sous ${threshold} m³/s. Situation normalisée.`
        );
        isFloodActive = false;
      }
    }
  } catch (error) {
    console.error('Error fetching and parsing JSONP:', error);
  }

  // Schedule the next check
  setTimeout(fetchDataAndCheck, checkInterval);
}

// Initial call to start the periodic check
fetchDataAndCheck();

