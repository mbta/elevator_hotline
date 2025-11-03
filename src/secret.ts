import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export const get = (secretName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
    const command = new GetSecretValueCommand({ SecretId: secretName });

    client.send(command, (err, data) => {
      if (data) {
        if (data.SecretString) {
          resolve(data.SecretString);
        } else {
          reject(new Error("SecretString not present"));
        }
      } else {
        console.log(`${err.name}: ${err.Message}`);
        reject(err);
      }
    });
  });
};
