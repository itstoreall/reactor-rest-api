const app = require('../app');
const db = require('../model/db');

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running. Port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server is not running! Error: ${err.message}`);
  process.exit(1);
});

/**
 * db - promise
 */
