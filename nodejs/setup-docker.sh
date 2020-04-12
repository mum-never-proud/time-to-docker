#!/bin/sh

docker build -t abhuz94/nodejs .

docker run -d -p 8080:3000 --name rest_countries abhuz94/nodejs
