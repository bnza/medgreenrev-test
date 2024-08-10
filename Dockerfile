# FROM node:20

FROM docker:27-cli

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:jammy

RUN apt-get update
RUN apt-get install ca-certificates curl
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc

 # Add the repository to Apt sources:
RUN echo \
   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
   $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
   tee /etc/apt/sources.list.d/docker.list > /dev/null \

RUN apt-get update

RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Set the work directory for the application
WORKDIR /app

# Set the environment path to node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH

# COPY the needed files to the app folder in Docker image
COPY --link ./app /app

# Get the needed libraries to run Playwright
RUN apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

RUN npm install
RUN npx playwright install chromium

#COPY --link docker-entrypoint.sh /usr/local/bin/docker-entrypoint
#RUN chmod +x /usr/local/bin/docker-entrypoint

# ENTRYPOINT ["docker-entrypoint"]
