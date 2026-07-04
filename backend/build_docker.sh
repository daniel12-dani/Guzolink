clear
echo "============================================================================"
echo "Building Docker Image for  guzolink app"
echo "============================================================================"

docker build -t fraolbmax/guzolink-app:latest .

# echo "============================================================================"
# echo "Docker Image built successfully"
# echo "Pushing Docker Image to Docker Hub"
# echo "============================================================================"
# # docker push fraolbmax/guzolink-app:latest
