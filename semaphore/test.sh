#!/usr/bin/env bash
export ELEVATOR_CODECOV_TOKEN="1683abbb-241b-4ef8-9033-6806ae192b88"
npm run test
bash <(curl -s https://codecov.io/bash) -t $ELEVATOR_CODECOV_TOKEN
