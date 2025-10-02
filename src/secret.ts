import AWS from "aws-sdk";

export const get = (secretName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    AWS.config.update({ region: process.env.AWS_REGION });

    const client = new AWS.SecretsManager({});

    client.getSecretValue({ SecretId: secretName }, (err, data) => {
      if (err) {
        if (err.code === "ResourceNotFoundException") {
          console.log(`The requested secret ${secretName} was not found`);
        } else if (err.code === "InvalidRequestException") {
          console.log(`The request was invalid due to: ${err.message}`);
        } else if (err.code === "InvalidParameterException") {
          console.log(`The request had invalid params: ${err.message}`);
        }
        reject(err);
      } else if (data.SecretString) {
        resolve(data.SecretString);
      } else {
        reject(new Error("Empty secret"));
      }
    });
  });
};
