const multer = require("multer");

const { DIR_PUBLIC_PATH } = require("./constants/paths.js");
const { ERROR_UPLOAD_IMAGE } = require("./constants/messages.js");

const { getRandomNumber } = require("./helpers/math.helper.js");
const { getDatetimeAsInteger } = require("./helpers/datetime.helper.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${DIR_PUBLIC_PATH}/images`);
    },
    filename: function (req, file, cb) {
        const datetime = getDatetimeAsInteger();
        const randomNumber = getRandomNumber(100000, 999999);
        const extension = file.originalname.slice(file.originalname.lastIndexOf("."));
        const filename = `img_${randomNumber}_${datetime}${extension}`;

        cb(null, filename);
    },
});

const fileFilter = function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(new multer.MulterError(400, ERROR_UPLOAD_IMAGE), false);
    }
};

const uploaderImage = multer({ storage, fileFilter });

module.exports = uploaderImage;