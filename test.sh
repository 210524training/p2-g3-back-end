#!/bin/bash

hello () {
  sls invoke local -f hello --path src/functions/hello/mock.json
}

"$@"