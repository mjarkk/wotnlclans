#!/bin/bash

set -e

# Build the go program
go build

# Run the program with the -dev flag for devlopment
./wotnlclans -dev "$@"
