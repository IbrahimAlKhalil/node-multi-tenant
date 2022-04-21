const { PrismaClient } = require('@prisma/client');
const { config } = require('dotenv');

try {
  config();
} catch (e) {
  //
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.WEBSITE_POSTGRES_DATABASE}`
    }
  }
});

async function run() {
  try {
    await prisma.cluster.create({
      data: {
        id: process.env.CLUSTER_ID,
        host: process.env.CLUSTER_HOST,
        name: 'Local Cluster 1',

        Institute: {
          create: {
            name: 'জামিয়া আরাবিয়া মাদ্রাসা',
            code: "1000",
            slug: 'madrasa',
            database: process.env.POSTGRES_DATABASE,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    //
  }
}

run();
