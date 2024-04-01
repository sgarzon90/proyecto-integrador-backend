const path = require("path");

const ENV_PATH = path.join(__dirname, "../../.env");
const DIR_PROJECT_ROOT = path.join(__dirname, "../");
const DIR_PUBLIC_PATH = path.join(DIR_PROJECT_ROOT, "public");
const DIR_IMAGES_PATH = path.join(DIR_PUBLIC_PATH, "images");

module.exports = {
    ENV_PATH,
    DIR_PUBLIC_PATH,
    DIR_IMAGES_PATH,
};