const fs = require('fs');


const removeTheFileFromServer = (localPath) => {
    try {
        fs.unlinkSync(localPath);
        return true;
    } catch (error) {
        console.log('failed to remove file from server');
        return false;
    }
}

module.exports = removeTheFileFromServer;