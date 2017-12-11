# Deployment to AWS ECS

## Deploy the Compose File to a Cluster

```
ecs-cli compose --file docker-compose-prod.yaml --project-name yak-chat service up

docker tag yak-chat-[server/client]:latest [user].dkr.ecr.eu-central-1.amazonaws.com/yak-chat-[server/client]:latest

docker push [user].dkr.ecr.eu-central-1.amazonaws.com/yak-chat-[server/client]:latest
```