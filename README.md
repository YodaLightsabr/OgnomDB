# OgnomDB
A quick database for Node.js
## About OgnomDB
OgnomDB is a quick database for Node.js. It is built on top of [NeDB](https://github.com/louischatriot/nedb/) and meant to be a quicker and more reliable version of [Quick.db](https://github.com/lorencerri/quick.db). Also, In case you haven't noticed already, Ognom is Mongo spelled backwards. 🤪

## Demonstration
```js
const db = require('ognom.db');
db.set('money', 50).then(() => {
  db.get('money').then(money => {
    console.log(money); // 50
    db.set('items', [
      'sword',
      'armor'
    ]).then(() => {
      db.get('*').then(allItems => {
        console.log(allItems); // { money: 50, items: [ 'sword', 'armor' ] }
      });
    });
  });
});
```

## Documentation

### `Ognom.get(key)`
Get a key in the database
 - `key` - The key to get. If getting a key nested inside of objects, use dot notation. Required

returns `Promise<any>`

### `Ognom.set(key, value)`
Set a key in the database
 - `key` - The key to set. If setting a key nested inside of objects, use dot notation. Required
 - `value` - The value to set the key to. Required

returns `Promise<Number>`

### `Ognom.push(key, value)`
Push a value to an array. The value at the specified key must be an array. Ognom will not create an array for you.
 - `key` - The key of the array to push to. If pushing to a key inside of objects, use dot notation. Required
 - `value` - The value to push to the array. Required

returns `Promise<Number>`


### `Ognom.delete(key)`
 - `key` - The key to delete. If deleting a key nested inside of objects, use dot notation. Required

returns `Promise<Number>`

That's it! If you have any questions I'm [YodaLightsabr#6565 on Discord](https://discord.gg/M8YY32acjm).
