const User = require('../models/user.model');

class Notification {
    createdNewPostNotification = async (author_id, post_id) => {
        // get the list of subscribers which is stored inside the author subscribers field.
        // loop for each id to add new notication to each subscriber
        //     add this notification inside the target User document
        //     check if user is existed or not (maybe user deleted account)
        //     find the target user with the _id and update its notification field by pushing the new notification
        
        
        const author = await User.findById(author_id).select("subscribers name userId _id");
        
        if (!author) {
            throw new Error("the author account not found with the provided _id")
        }

        const targetUsers = author.subscribers;

        // send the notification to each user from author user
        targetUsers.forEach( async (toUser_id) => {
            // first check if user is still exist or not
            const user = User.findById(toUser_id).select("name userId _id");

            if (!user) {
                return true;
            }

            // update the users notification field
            const updatedUser = await User.findByIdAndUpdate(toUser_id, {
                $push: {
                    notifications: {
                        message: "shared new post",
                        post_id: post_id,
                        notificationType: 'cratePost',
                        user_id: author_id
                    }
                }
            }, { new: true }).select('_id userId name');

        });

    }

    postLikeNotification = async (postId, userId) => {
        
    }
}


const notification = new Notification();

module.exports = notification;