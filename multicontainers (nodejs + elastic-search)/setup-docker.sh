#!/bin/sh

docker build -t abhuz94/rest-cities .

docker network create rest-cities-network

docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" --net rest-cities-network --name es docker.elastic.co/elasticsearch/elasticsearch:6.3.2

docker run -d -p 8080:3000 --net rest-cities-network --name rest_cities abhuz94/rest-cities
