const mongoose = require('mongoose');
console.log(mongoose);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  console.log('Connected to MongoDB');
}   
