clear
echo "============================================================================"
echo "Removing Guzolink App in Docker"
echo "============================================================================"
docker stop guzolink-test
docker rm guzolink-test


echo "Starting Guzolink App in Docker"
echo "============================================================================"
docker run -d \
  --name guzolink-test \
  --network host \
  --env-file .env.production \
  fraolbmax/guzolink-app:latest
  
docker logs -f -t guzolink-test
