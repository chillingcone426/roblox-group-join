const noblox = require("noblox.js");
var axios = require("axios").default;

//const Discord = require('discord.js');

function extractHeaderValue(headers, key) {
    for (let i = 0; i < headers.length; i++) {
      if (headers[i] === key) {
        // If the key is found, return the next element as its value
        return headers[i + 1];
      }
    }
    return null; // Return null if key is not found
  }

module.exports = {
  name: "groupJoin",
  run: async (client, message, args) => {
    await noblox.setCookie("COOKIEHERE")
    const token = await noblox.getGeneralToken()
    //message.reply("YES!!!" + token)
    const groupid = args[0]
    if(!groupid) return message.reply("No groupid!")

    const response = await fetch(`https://groups.roblox.com/v1/groups/${groupid}/users`, {
      method: 'POST',
      headers: {
        Cookie: ".ROBLOSECURITY=COOKIEHERE;",
        ["X-CSRF-TOKEN"]: `${token}`,
        ["Content-Type"]: "application/json"
      },
      body: {
        "sessionId": "",
        "redemptionToken": ""
      }
    });

    const metadata64 = response.headers.get('rblx-challenge-metadata')

    const metadata = JSON.parse(atob(metadata64))
    const CaptchaId = metadata.unifiedCaptchaId
    const blob = metadata.dataExchangeBlob
    const action_type = metadata.actionType
    const public_key = "63E4117F-E727-42B4-6DAA-C8448E9B137F"
    const website_url = "https://www.roblox.com"
    const website_subdomain = "roblox-api.arkoselabs.com"

    const response2 = await fetch(`https://capbypass.com/api/createTask`, {
      method: 'POST',
      headers: {
        ["Content-Type"]: "application/json"
      },
      body: JSON.stringify({
        "clientKey": "API_KEY_HERE",
        "task": {
          "type": "FunCaptchaTask",
          "websiteURL": website_url,
          "websitePublicKey": public_key,
          "funcaptchaApiJSSubdomain": "https://" + website_subdomain,
          "data": "{\"blob\": \"" + blob + "\"}",
          "proxy": "YOUR_PROXY_HERE"
        }
      })
    });
    const value = await response2.json();
    const max = 100
    var total = 0

    

    async function repeatAction() {
        
        while (total < max) {
            const response = await fetch(`https://capbypass.com/api/getTaskResult`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "clientKey": "API_KEY_HERE",
                    "taskId": value.taskId
                })
            });
    
            const data = await response.json();
            console.log(data)
    
            if (data.status === 'DONE') {
                // Return the valid solution
                return data.solution;
            }else if(data.status === 'ERROR'){
                return false;
            }else {
                // Increment attempt count
                total++;
                // Wait for a short duration before retrying (adjust as needed)
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    
        // Return null or false if no valid solution is found after maxAttempts
        return null;
    }
      const solution = await repeatAction()
      if(!solution) return message.reply("Error!")

      const finalmeta  = `{"unifiedCaptchaId":"${CaptchaId}","captchaToken":"${solution}","actionType":"${action_type}"}`;
      const finalmeta64 = btoa(finalmeta)
      const tokenup = await noblox.getGeneralToken()

      await fetch(`https://apis.roblox.com/challenge/v1/continue`, {
      method: 'POST',
      headers: {
        Cookie: ".ROBLOSECURITY=COOKIEHERE;",
        ["X-CSRF-TOKEN"]: tokenup,
        ["Content-Type"]: "application/json"
      },
      body: JSON.stringify({"challengeId": CaptchaId, "challengeMetadata": finalmeta, "challengeType": "captcha"}
      )
    });

    const finalaaaa = await fetch(`https://groups.roblox.com/v1/groups/${groupid}/users`, {
      method: 'POST',
      headers: {
        Cookie: ".ROBLOSECURITY=COOKIEHERE;",
        ["X-CSRF-TOKEN"]: tokenup,
        ["Content-Type"]: "application/json",
        ['rblx-challenge-id']: CaptchaId,
        ["rblx-challenge-type"]: "captcha",
        ["rblx-challenge-metadata"]: finalmeta64
      },
      body: JSON.stringify({
        "sessionId": "",
        "redemptionToken": ""
      }
      )
    });


    
    

    



    message.reply("Wow! Joined a group via the api!!!!!!!!!!")

    
}};
