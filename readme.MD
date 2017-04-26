# Eureka stalker
Tester service for eureka.

## Metrics and analytics
Access analytics through Azure Application Insights, using the following:

- [local](https://analytics.applicationinsights.io/subscriptions/fcb1f62a-582d-445d-89b4-f555390ff683/resourcegroups/eureka-stalker-local/components/eureka-stalker-local#/discover/home?apptype=web) environment
- [dev](https://analytics.applicationinsights.io/subscriptions/fcb1f62a-582d-445d-89b4-f555390ff683/resourcegroups/eureka-stalker-dev/components/eureka-stalker-dev#/discover/home?apptype=Node.JS) environment 
- [beta](https://analytics.applicationinsights.io/subscriptions/4d182587-1db1-4193-91ac-175177f48695/resourcegroups/eureka-beta/components/eureka-beta-stalker#/discover/query/main?apptype=Node.JS) environment

## Deploying
Once you have everything set up, run one of the following to deploy:

```
gcloud app deploy dev.yaml --project dotted-vim-164110 --stop-previous-version
```
```
gcloud app deploy beta.yaml --project eureka-beta --stop-previous-version
```