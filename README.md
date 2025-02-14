# 1 - Introduction

This project is a dedicated digital healthcare platform backend, offering a range of essential services.

The main technology stack includes:

- Frontend using **Next.js**, providing users with high-performance interactive experiences and smooth interfaces.
- Backend powered by **Node.js**, offering reliable backend support and robust data processing capabilities to the system.
- Database management utilizing **MongoDB**, providing scalable and flexible storage solutions for managing data effectively.
- Architecture utilizing **Kubernetes**, achieving high availability, scalability, and fault tolerance to ensure the system runs smoothly.
- Message delivery with **NATS** and **Bull**, enabling efficient message passing and task handling to maintain system real-time performance and reliability.

With this comprehensive technology stack, we have constructed a system architecture that meets users' demands for security, stability, and high performance. We provide reliable data processing, storage, and message delivery mechanisms to deliver premium service experiences to our users.



# 2 - Installation

All installation is based on Windows platform

### 2.1 - Docker (admin required)

1. Register for a DockerHub account

   > URL: https://hub.docker.com/signup

2. Install wsl2

   1. open PowerShell as Administrator and run `wsl --install`
   2. run `wsl --set-default-version 2`
   3. restart computer

3. Install Docker Desktop

   > URL: https://docs.docker.com/desktop/install/windows-install/

4. Check Docker is working

   ~~~bash
   $ docker
   ~~~

   

### 2.2 - Kubernetes (admin required)

1. under Docker Desktop Setting
2. Kubernetes ---> Enable Kubernetes
3. `kubectl version` in terminal to check it's working



### 2.3 - Ingress-Nginx

create Load Balancer and ingress services in our cluster

> URL: https://kubernetes.github.io/ingress-nginx/deploy/

In terminal run:

~~~bash
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
~~~



### 2.4 - Skaffold (admin required)

We only use it for development in Microservices

Open PowerShell in administration, run command:

~~~bash
# install choco
$ Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# test choco if it's installed correctly
$ choco

# install skaffold
$ choco install -y skaffold
~~~



### 2.5 - Change Host File For test (admin required)

`C:\Windows\System32\Drivers\etc\hosts`

Add a text in the hosts file

~~~markdown
# change ip to your own ip
192.168.1.228 my-app.dev
~~~



### 2.6 - Add Environment Variable

in the terminal

~~~bash
$ kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
~~~





# 3 - Run Backend

It's better to run `npm i` for your server to avoid the type error or no module error.

In root repository of the project, run command in terminal:

~~~bash
$ skaffold dev
~~~







