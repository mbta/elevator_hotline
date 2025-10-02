# elevator hotline

The MBTA elevator hotline is a service built on top of AWS connect and lambda.

## Amazon Connect

The contact flow is included here as hotline_prod.json/hotline_dev.json

<img src="/hotline_dev.png" alt="Hotline IVR"/>

When making changes in amazon connect make sure to export and update the json
file in the git repo.

## AWS Lambda

The lambda is called whenever a call is made to the elevator hotline. It in turn
calls the mbta api to get the current alerts and then the affected stations. It
then builds a payload broken up by line for the ivr.

To run the lambda locally, put an api key in .env.override as API_KEY

First install the dependencies by running

```
npm install
```

then run

```
npm run local
```
