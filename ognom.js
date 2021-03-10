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
var dbdelete = function (key) {
  return new Promise((resolve, reject) => {
    dbset(key, undefined).then(resolve).catch(reject);
  });
}
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
