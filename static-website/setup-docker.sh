#!/bin/sh

docker build -t abhuz94/static-site .

docker run -d -p 8080:80 --name static-stite abhuz94/static-site
