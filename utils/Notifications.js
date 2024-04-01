const User = require('../models/user.model');

class Notification {
    createdNewPostNotification = async (author_id, userIdOfPerformedActionUser, post_id) => {
        // get the list of subscribers which is stored inside the author subscribers field.
        // loop for each id to add new notication to each subscriber
        //     add this notification inside the target User document
        //     check if user is existed or not (maybe user deleted account)
        //     find the target user with the _id and update its notification field by pushing the new notification
        
        console.log('sending notifications to all subscriberd users')
        
        const author = await User.findById(author_id).select("subscribers name userId _id");
        
        if (!author) {
            throw new Error("the author account not found with the provided _id")
        }

        const targetUsers = author.subscribers;

        // send the notification to each user from author user
        targetUsers.forEach( async (toUser_id) => {
            // first check if user is still exist or not
            const user = await User.findById(toUser_id).select("name userId _id");

            console.log('sending notification to ', user?.userId)

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
                        user_id: author_id,
                        userId: userIdOfPerformedActionUser,
                    }
                }
            }, { new: true }).select('_id userId name');

        });

    }

    postLikeNotification = async (post_id, authorOfPost_id, user_id, userIdOfPerformedActionUser) => {
        
        try {
            const newNotification = await User.findByIdAndUpdate(authorOfPost_id, {
                $push: {
                    notifications: {
                        message: "liked your post",
                        post_id,
                        notificationType: 'likePost',
                        user_id,
                        userId: userIdOfPerformedActionUser,
                    }
                }
            });
        } catch (error) {
            console.log('failed to send notification to the author of post: ', error)
        }
    }

    likeCommentNotification = async (commentAuthor_id, user_id, userIdOfPerformedActionUser, post_id) => {
        
        try {
            const newNotification = await User.findByIdAndUpdate(commentAuthor_id, {
                $push: {
                    notifications: {
                        message: "liked your comment",
                        post_id,
                        notificationType: 'likeComment',
                        user_id,
                        userId: userIdOfPerformedActionUser,
                    }
                }
            });
        } catch (error) {
            console.log('failed to send notification to the author of comment: ', error)
        }
    }

    commentedOnPostNotification = async (commentAuthor_id, userIdOfPerformedActionUser, targetUserIdToSendNotification, post_id) => {
        // user x commented on your post
        
        try {
            const newNotification = await User.findByIdAndUpdate(targetUserIdToSendNotification, {
                $push: {
                    notifications: {
                        message: "commented on your post",
                        post_id,
                        notificationType: 'commentPost',
                        user_id: commentAuthor_id,
                        userId: userIdOfPerformedActionUser,
                    }
                }
            });
        } catch (error) {
            console.log('failed to send notification to the author of post for someone commented: ', error)
        }
    }
}


const notification = new Notification();

module.exports = notification;