#!/bin/bash

set -e

cd "$(dirname "$0")"


IMAGE_BACKEND="fraolbmax/guzolink-backend:latest"
IMAGE_FRONTEND="fraolbmax/guzolink-frontend:latest"

function pause() {
    read -p "Press Enter to continue..."
}

function build() {
    clear
    echo "======================================"
    echo "Building Docker Images..."
    echo "======================================"

    docker compose build

    pause
}

function run_local() {
    clear
    echo "======================================"
    echo "Starting Local Environment..."
    echo "======================================"

    docker compose down
    docker compose up --build
}

function push() {
    clear
    echo "======================================"
    echo "Pushing Images..."
    echo "======================================"

    docker push $IMAGE_BACKEND
    docker push $IMAGE_FRONTEND

    pause
}

function pull() {
    clear
    echo "======================================"
    echo "Pulling Latest Images..."
    echo "======================================"

    docker compose pull

    pause
}

function start_prod() {
    clear
    docker compose up -d

    pause
}

function stop_all() {
    clear
    docker compose down

    pause
}

function logs() {
    clear
    docker compose logs -f
}

while true
do
    clear

    echo "========================================"
    echo "      GUZOLINK DEPLOYMENT TOOL"
    echo "========================================"
    echo ""
    echo "1) Build Images"
    echo "2) Run Locally"
    echo "3) Push Images"
    echo "4) Pull Images"
    echo "5) Start Production"
    echo "6) Stop Containers"
    echo "7) View Logs"
    echo "0) Exit"
    echo ""

    read -p "Select option: " OPTION

    case $OPTION in
        1) build ;;
        2) run_local ;;
        3) push ;;
        4) pull ;;
        5) start_prod ;;
        6) stop_all ;;
        7) logs ;;
        0) exit ;;
        *) echo "Invalid option"; pause ;;
    esac
done