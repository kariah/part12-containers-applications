Komentoja

docker-compose -f docker-compose.dev.yml up 
docker-compose -f docker-compose.dev.yml down --volumes

--

winpty docker exec -it reverse-proxy bash

--

docker-compose up
docker-compose up --build
testaus: komento CI=true npm test
