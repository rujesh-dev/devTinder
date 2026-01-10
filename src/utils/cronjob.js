const cron = require('node-cron');
const { subDays, endOfDay, startOfDay } = require('date-fns')
const ConnectionRequestModel = require('../models/ConnectionRequest');
const sendEmail = require("./sendEmail_temp")

cron.schedule('0 8 * * *', async() => {

    try {
        const Yesterday = subDays(new Date(), 1)
        const startOfYesterDay = startOfDay(Yesterday);
        const endOfYesterday = endOfDay(Yesterday)
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: startOfYesterDay,
                $lt: endOfYesterday
            }
        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.email))]
        console.log(listOfEmails);
        
        for (const email of listOfEmails) {
            try {
                const res = await sendEmail.run(
                    `New friend request pending from ${email}`,
                    "Please login to devTinder"
                )
                console.log(res);
            }
            catch (err) {
                console.error(err.message);

            }
        }
    }
    catch (err) {
        console.error(err.message);

    }
})
