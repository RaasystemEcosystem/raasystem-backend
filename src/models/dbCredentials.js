const AWS = require('aws-sdk');

const secretArn = process.env.DB_PASSWORD;
const region = 'us-west-2';

const secretsManager = new AWS.SecretsManager({ region });

async function getDbCredentials() {
  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretArn }).promise();

    const secret = 'SecretString' in data
      ? JSON.parse(data.SecretString)
      : JSON.parse(Buffer.from(data.SecretBinary, 'base64').toString('ascii'));

    return {
      host: process.env.DB_HOST,
      user: secret.DB_USER,
      password: secret.DB_PASSWORD,
      database: secret.DB_NAME || 'your-database-name',
    };
  } catch (err) {
    console.error('Secrets Manager error:', err);
    throw err;
  }
}

module.exports = { getDbCredentials };
