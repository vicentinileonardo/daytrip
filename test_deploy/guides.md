In order to build the docker images for Azure, you need to change the `Dockerfile` from
 
```dockerfile
FROM python:3.9-alpine
```

to

```dockerfile
FROM --platform=linux/amd64 python:3.9-alpine
```

for the Python images and

```dockerfile
FROM node:18.14.1
```

to

```dockerfile
FROM --platform=linux/amd64 node:18.16-alpine
```

for the Node images.



Guides


Azure Container Instances

https://learn.microsoft.com/en-us/azure/container-instances/tutorial-docker-compose

https://docs.docker.com/cloud/aci-integration/

https://stackoverflow.com/questions/69464001/docker-compose-container-name-use-dash-instead-of-underscore

https://learn.microsoft.com/en-us/answers/questions/1195525/azure-container-instance-container-group-quota-sta

https://docs.docker.com/compose/compose-file/deploy/

https://learn.microsoft.com/en-us/azure/container-registry/container-registry-authentication?tabs=azure-cli

https://stackoverflow.com/questions/75675315/docker-compose-volume-on-azure-storage-how-to-bind-to-a-file

https://docs.docker.com/cloud/aci-integration/#using-azure-file-share-as-volumes-in-aci-containers

https://learn.microsoft.com/it-it/azure/container-registry/container-registry-troubleshoot-login

https://learn.microsoft.com/en-us/answers/questions/1167966/he-requested-resource-is-not-available-in-the-loca

https://learn.microsoft.com/en-us/azure/container-instances/container-instances-region-availability#linux-container-groups

https://learn.microsoft.com/en-us/azure/container-instances/container-instances-troubleshooting#container-continually-exits-and-restarts-no-long-running-process

https://learn.microsoft.com/en-us/answers/questions/1166204/although-i-have-mentioned-restart-no-in-my-docker


Azure App Service

https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings?tabs=kudu%2Cdotnet

https://learn.microsoft.com/en-us/answers/questions/325909/i-want-to-use-azure-app-service-environment-variab

https://www.codit.eu/blog/mounting-volumes-on-azure-web-app-for-containers/?country_sel=be

https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?pivots=container-linux&tabs=debian#use-persistent-shared-storage

https://learn.microsoft.com/en-us/azure/app-service/tutorial-multi-container-app#modify-configuration-file

https://stackoverflow.com/questions/52004623/azure-docker-compose-fails-with-the-environment-section

https://learn.microsoft.com/en-us/azure/app-service/configure-custom-container?pivots=container-linux&tabs=debian

https://github.com/projectkudu/kudu/issues/2512

https://stackoverflow.com/questions/69054921/docker-on-mac-m1-gives-the-requested-images-platform-linux-amd64-does-not-m?rq=3

