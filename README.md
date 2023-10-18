[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/UxpU_KWG)
# Serverless deployment
The function is deployed serverlessly using Google Cloud. The function will be triggered by HTTP request to an URL link generated after the deployment.

Steps for devs to deploy from their local working environment:
1. Refer to (Google Cloud documentation)[(https://cloud.google.com/functions/docs/create-deploy-gcloud)] on how to deploy using Google Cloud CLI:
2. After initialize gcloud, run the following command in this directory. For `region`, check the available region on Google Cloud and change it correspondingly.
```
gcloud functions deploy fetch_leetcode_questions --gen2 --runtime=nodejs20 --region=us-central1 --source=. --entry-point=fetch_leetcode_questions --trigger-http --allow-unauthenticated
```

3. Waiting for deployment to be completed, access the URL in the respone from the command. The URL should be in the following format where `[REGION]` is the region you use in the command, `[GCLOUD_PROJECTNAME]` is the project name currently in the configuration of Google Cloud CLI, running `gcloud config list` to see more about configuration.

`https://[REGION]-[GCLOUD_PROJECTNAME].cloudfunctions.net/fetch_leetcode_questions`