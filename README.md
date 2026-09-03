# TravelEase Tourism Management System Project

A Dockerized Tourism Management System with a responsive HTML/CSS/JavaScript frontend, Node.js/Express backend, and MySQL database.

## Features

* Explore destinations
* View travel packages
* Create bookings
* Store bookings permanently in MySQL
* View bookings from MySQL
* Delete bookings from MySQL
* Search/filter bookings
* Booking statistics and revenue
* Dockerized frontend, backend, and database

## Technology Stack

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* MySQL 8.0
* Nginx
* Docker / Docker Compose
* Git / GitHub

## Architecture

Browser → Nginx → Node.js/Express → MySQL

Nginx serves the frontend and proxies `/api/\*` requests to the backend. MySQL is available only inside the Docker Compose network.

## Run Locally

```powershell
docker compose down
docker compose up -d --build
docker compose ps
```

Open:

```text
http://localhost
```

Test the API:

```powershell
curl http://localhost/api
curl http://localhost/api/destinations
curl http://localhost/api/packages
curl http://localhost/api/bookings
```

## Important

The database uses a Docker volume named `mysql\_data`, so bookings persist when containers are restarted.

Do not commit `backend/.env` to GitHub. It is already ignored by `.gitignore`.

## GitHub

```powershell
git init
git add .
git commit -m "Complete TravelEase tourism management system"
git branch -M main
git remote add origin YOUR\_GITHUB\_REPOSITORY\_URL
git push -u origin main
```

