var Datastore = require('nedb'), db = new Datastore({ filename: __dirname + '/ognom.db', autoload: true });
var createdb = function () {
  return new Promise((resolve, reject) => {
    var doc = { belongsTo: 'ognom', rawData: {} };
    db.insert(doc, function (err, newDoc) {
      if (err) return reject(err);
      resolve(newDoc);
    });
  });
}
/**
 * Get a value from the database
 * @param {string} index - The key that you want to get
 */
var dbget = function (index) {
  return new Promise(async (resolve, reject) => {
    db.find({ belongsTo: 'ognom' }, async function (err, docs) {
      if (err) return reject(err);
      if (docs.length == 0) {
        var doc = await createdb();
        if (index == "*") {
          return resolve(doc.rawData);
        }
        try {
          var res = dotnotation(index, doc.rawData);
        } catch (error) {
          var res = null;
        }
        return resolve(cleanObject(res));
      }
      if (index == "*") {
        return resolve(cleanObject(docs[0].rawData));
      }
      try {
        var res = dotnotation(index, docs[0].rawData);
      } catch (error) {
        var res = null;
      }
      return resolve(cleanObject(res));
    });
  });
}
/**
 * Set a key in the database
 * @param {string} key - The key that you want to set
 * @param {*} value - The value to set
 */
var dbset = function (key, value) {
  return new Promise((resolve, reject) => {
    var setObj = {};
    setObj["rawData."+key] = value;
    db.update({ belongsTo: 'ognom' }, { $set: setObj }, function (err, numReplaced) {
      if (err) return reject(err);
      resolve();
    });
  });
}
/**
 * Delete a key in the database
 * @param {string} key - The key that you want to delete
 */
var dbdelete = function (key) {
  return new Promise((resolve, reject) => {
    dbset(key, undefined).then(resolve).catch(reject);
  });
}
/**
 * Push to an array in the database
 * @param {string} key - The key that you want to push to
 * @param {*} value - The value to push
 */
var dbpush = function (key, value) {
  return new Promise(async (resolve, reject) => {
    var data = await dbget(key);
    if (!data instanceof Array) return reject(new Error("Cannot push to a non-array object"));
    data.push(value);
    var setObj = {};
    setObj["rawData."+key] = data;
    db.update({ belongsTo: 'ognom' }, { $set: setObj }, function (err, numReplaced) {
      if (err) return reject(err);
      resolve();
    });
  });
}
var dotnotation = function (ref, object) {
  return ref.split('.').reduce((o,i)=>o[i], object);
}
var cleanObject = function (original) {
  try {
    var newObject = new Object();
    newObject = JSON.parse(JSON.stringify(original));
    return newObject;
  } catch (err) {
    return original;
  }
}
var output = {};
output.get = dbget;
output.set = dbset;
output.push = dbpush;
output.delete = dbdelete;
module.exports = output;
