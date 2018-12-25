#!/bin/bash

# Build the go program
go build || { echo 'Failed to build'; exit 1; }

# Run the program with the -dev flag for devlopment
./wotnlclans -dev "$@"
