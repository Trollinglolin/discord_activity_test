import { DiscordSDK } from "@discord/embedded-app-sdk";

import rocketLogo from '/rocket.png';
import "./style.css";

// Will eventually store the authenticated user's access_token
let auth;

// Get the frame ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const frameId = urlParams.get('frame_id');

// Check if we're running in an iframe
const isIframe = window.self !== window.top;

// Only initialize Discord SDK if we have a frame_id and are in an iframe
if (frameId && isIframe) {
  const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
  
  // Set up the SDK
  setupDiscordSdk(discordSdk).then(() => {
    console.log("Discord SDK is authenticated");
    // We can now make API calls within the scopes we requested in setupDiscordSDK()
  }).catch(console.error);
}

async function setupDiscordSdk(discordSdk) {
  try {
    await discordSdk.ready();
    console.log("Discord SDK is ready");

    // Authorize with Discord Client
    const { code } = await discordSdk.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: [
        "identify",
        "guilds",
        "applications.commands"
      ],
    });

    // Retrieve an access_token from your activity's server
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const { access_token } = await response.json();

    if (!access_token) {
      throw new Error("No access token returned from server");
    }

    // Authenticate with Discord client (using the access_token)
    auth = await discordSdk.commands.authenticate({
      access_token,
    });

    if (!auth) {
      throw new Error("Authenticate command failed");
    }
    
    console.log("Authentication successful");
  } catch (error) {
    console.error("Error setting up Discord SDK:", error);
    throw error; // Re-throw to be caught by the caller
  }
}

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1>Hello, World!</h1>
  </div>
`;