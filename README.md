# VigiCrue Notif

The VigiCrue Notification system is designed to provide real-time monitoring of river water levels and send notificaton accordingly. It uses environmental data to alert users when the river's flow rate exceeds safe thresholds, indicating potential flooding conditions.

## Prerequisites

The only prerequisite for this project is Docker. Ensure Docker is installed and running on your machine. If Docker is not already installed, you can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).

## Setup

Before running the application, you need to set up the environment variables:

1. **Copy the Example Environment File:**
   - Copy the provided `.env.example` file to a new file named `.env`.
   - `cp .env.example .env`

2. **Configure Environment Variables:**
   - Open the `.env` file in a text editor.
   - Fill in the values for each environment variable. These will configure the SMTP settings for sending notifications and set thresholds for alerts.

## Running the Application

### Development Environment

To run the application in a development environment where you can see live updates as you change the code:

1. Navigate to the project directory in your terminal.
2. Run the following command:
   ```
   docker compose up -d
   ```
   This command starts the services defined in `docker-compose.yml` in detached mode.

### Production Environment

To run the application in a production environment:

1. Navigate to the project directory in your terminal.
2. Execute the following command:
   ```
   docker compose -f docker-compose.prod.yml up -d
   ```
   This command builds a lightweight production environment using the Dockerfile, configuring it for production with optimized settings.

## Additional Information

- **Development Setup**: Uses Node.js 20 with a volume mapped to the project for live reloading.
- **Production Setup**: Utilizes Node.js 20 Alpine, optimized for a smaller footprint and production use.

For more information on how to use Docker and Docker Compose, refer to the [official Docker documentation](https://docs.docker.com/).

Thank you for using the VigiCrue River Monitoring System. Stay safe and informed with real-time environmental monitoring.

