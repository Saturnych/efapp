'use strict';

const path = require('path');
const md5 = require('js-md5');

const _DIR = __dirname;
const _ENV = process.env;

const common = require(path.join(_DIR,"./lib/common.js"));
const config = require(path.join(_DIR,"./lib/config.js")).settings;

const { saveImgFromData, saveFile, saveLog }  = require(path.join(_DIR,"./savefiles.js"));

var Datastore = require('nedb'), neDB = {};

initNeDB();

async function initNeDB() {
  try {
    dataconf.nedb.collections.forEach((el) => {
      var collName = el.name;
      var ds = new Datastore({ filename: path.join(_DIR, dataconf.nedb.filePath, el.database)});
      for (var key in el.index) {
        ds.ensureIndex({ fieldName: el.index[key] }, (err) => {});
      }
      for (var key in el.unique) {
        ds.ensureIndex({ fieldName: el.unique[key], unique: true }, (err) => {});
      }
      ds.loadDatabase();
      Object.defineProperty(neDB, collName, {
        value: ds,
        writable: true,
        enumerable: true,
        configurable: true
      });
    });
  } catch (e) { console.error(`neDB error: "${e}"`); }
}

var getDataNeDB = async (collName,pars,sort,skip,limit) => { // { _id: 'id12343' },{ creation: -1, updated: -1 },0,20
  return new Promise((resolve, reject) => {
    try {
      if (!neDB || neDB[collName] === undefined) reject(false);
      var collection = neDB[collName];
      if (limit===1)
        collection.findOne(pars, function (err, doc) {
          if (!err) err = true;
          if (doc && doc._id) resolve(doc); else reject(err);
        });
      else
        collection.find(pars).sort(sort).skip(skip).limit(limit).exec(function (err, docs) {
          if (!err) err = 'getDataNeDB error!';
          if (docs && docs.length) resolve(docs); else reject(err);
        });
    } catch (e) { console.error(`getDataNeDB error: "${e}"`);  reject(e); }
  });
};

var addDataNeDB = async (collName,data) => {
  return new Promise((resolve, reject) => {
    try {
      if (!neDB || neDB[collName] === undefined) reject(false);
      var collection = neDB[collName];
      var ext = '.jpg';
      var dt = Date.now(); // msec
      var ts = Math.round(dt/1000); // sec
      var timestr = common.dateToFormat(dataconf.nedb.dateFormat);
      var file = dt+ext;
      var imageFile = path.join(_DIR, dataconf.files.imagePath, file);
      if (!data.hash && data.dataURI) data.hash = md5(data.dataURI);
      if (data.dataURI) saveImgFromData(data.dataURI,imageFile); else file = null;
      const objInsert = {
          'age': Math.round(data.age),
          'gender': data.gender,
          'genderProbability': data.genderProbability,
          'creation': ts,
          'updated': timestr,
          'hash': data.hash,
          'file': file,
          'base64': data.dataURI
      };
      console.log(`addDataNeDB objInsert: "${objInsert}"`);
      if (collection) collection.insert(objInsert, (err, doc) => {
        if (!err) err = 'addDataNeDB error!';
        if (doc && doc._id) {
          if (doc.base64 && imageFile) saveImgFromData(doc.base64,imageFile);
          resolve(doc._id);
        } else
          reject(err);
      });
    } catch (e) { console.error(`addDataNeDB error: "${e}"`); reject(e); }
  });
};

module.exports.neDB = neDB;
module.exports.getDataNeDB = getDataNeDB;
module.exports.addDataNeDB = addDataNeDB;
