docker login registry.gitlab.com -u danphi
docker build -t registry.gitlab.com/danphi/nimp .
docker push registry.gitlab.com/danphi/nimp
ssh root@botbattles.io "cd /shipyard/compose; docker-compose pull; docker-compose up -d"