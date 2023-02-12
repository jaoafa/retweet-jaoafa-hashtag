#!/bin/sh

while :
do
  node index.js || true

  echo "Waiting..."

  # wait 1 hour
  sleep 3600
done