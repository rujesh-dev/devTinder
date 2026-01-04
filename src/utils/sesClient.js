const {SESClient} =  require("@aws-sdk/client-ses");
  
// Set the AWS Region.

// Create SES service object.
const sesClient = new SESClient({ 
    region: process.env.REGION
});
module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]