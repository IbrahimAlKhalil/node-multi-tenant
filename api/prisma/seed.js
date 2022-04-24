const { PrismaClient } = require('./client');
const { config } = require('dotenv');
const { hash } = require('argon2');

try {
  config();
} catch (e) {
  //
}

const prisma = new PrismaClient();

async function run() {
  try {
    await prisma.user.create({
      data: {
        email: 'demo@saharait.com',
        type: 'ADMIN',
        gender: 'MALE',
        username: 'demo',
        password: await hash('demo'),
      },
    });
  } catch (e) {
    //
  }
}

run();
