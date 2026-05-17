const mongoose = require('mongoose');
const { connectDatabase } = require('./config/db');
const Resource = require('./models/Resource');
const VentPost = require('./models/VentPost');
const { seedResources, seedVents } = require('./utils/seedData');

async function seed() {
  await connectDatabase();

  await Promise.all([
    Resource.deleteMany({}),
    VentPost.deleteMany({}),
  ]);

  await Resource.insertMany(seedResources);
  await VentPost.insertMany(seedVents);

  console.log('Heart-Haven data seeded');
}

seed()
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close().catch(() => {});
  });
