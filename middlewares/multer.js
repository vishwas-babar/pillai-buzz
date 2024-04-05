const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './public/temp');
//     },
//     filename: function(req, file, cb){
//         const filename = Date.now() + file.originalname;
//         cb(null, filename)
//     }
// })


const storage = multer.memoryStorage()

const upload = multer({ storage: storage })

module.exports = upload;
