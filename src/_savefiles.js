'use strict';

const fs = require('fs-extra');
const path = require('path');
const storage = require('electron-json-storage');

const _DIR = __dirname;
const _ENV = process.env;

const common = require(path.join(_DIR,"./lib/common.js"));
const config = require(path.join(_DIR,"./lib/config.js")).settings;

var saveImgFromData = (imageSrc,imageFile) => {
  try {
    var imageBase64 = imageSrc.replace(/data:image\/(pjpeg|jpeg|png|gif);base64,/gi,'');
    var imageBuffer = Buffer.from(imageBase64, 'base64');
    if (imageBuffer) saveFile(imageFile, imageBuffer, false, 'binary');
  } catch (e) {
    console.error(`saveImgFromData catching error: "${e}"`);
  }
};

var saveFile = async (file,src,append,enc,mod,flg) => {
  try {
    if (common.empty(file) || common.empty(src)) return false;
    var opts = { encoding: 'utf8', mode: 0o666, flag: 'w' };
    if (!common.empty(enc)) opts.encoding = enc;
    if (!common.empty(mod)) opts.mode = mod;
    if (!common.empty(flg)) opts.flag = flg;
    var cb = function (err) {
      if (err) throw err;
      if (config.debug) console.log(`The file ${file} saved!`);
    }
    return (append)?fs.appendFile(file,src,opts,cb):fs.writeFile(file,src,opts,cb);
  } catch (e) {
    console.error(`saveFile catching error: "${e}"`);
  }
};

var saveLog = async (file,logs,show) => {
  try {
    if (common.empty(file) || common.empty(logs)) return false;
    var slog = common.dateToFormat(config.logs.dateFormat); // [17/Sep/2018:20:23:22 +0300]
    if (config.logs.pretty)
        slog += "\n"+JSON.stringify(logs,null,2);
    else
        slog += " "+JSON.stringify(logs);
    if (show) console.log(slog);
    return saveFile(file, slog, true, config.logs.encoding); // "utf8"
  } catch (e) {
    console.error(`saveLog catching error: "${e}"`);
  }
};

module.exports.saveImgFromData = saveImgFromData;
module.exports.saveFile = saveFile;
module.exports.saveLog = saveLog;
module.exports.storage = storage;
