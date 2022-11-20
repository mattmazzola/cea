# CEA SC2 Announcement Generator

This application programmatically accesses CEA data and contrusts announcement messages the SC2 captain would normally send to the team.

## What are the troubles of being captain?

### 1 Unknown Availability of Information 

- You do not know when opponents and maps for the week will be posted  
    - This controls when you can send announcement of opponent and maps to your team

- You do now know when your opponent will submit their lineup
    - This controls when you can post each teammates opponent per match

#### Problem

- To get best service for team you would have to check CEA website at high frequency
- This increases effort / cost of being Captain role and decreases willingness to participate

### 2 Information Split

- The matches and details are on https://app.playcea.com/  
- The maps and mode for each match is on https://cea.gg/  
    - https://cea.gg/pages/sc2-maps-championship-series  
    - https://cea.gg/pages/sc2-maps-collegiate-team-league  

#### Problem

- This increases cost to associate each map with each game of the match

### 3 Scheduling

- Sometimes players cannot play at the normal time (11 AM PST) and ask to reshecule that game. This requires these steps

    - Go to CEA Discord to locate Captain of other team
    - @mention or direct message asking for reschedule with time window
    - When waiting for the response this creates another timing issue and can go back forth

## Solutions

1. Manual triggered
    - Application collects data, assembles, and generates announcement

1. Automatic (Blocke)
    - Announcement Generator would run on interval and automatically send message to Discord when new information is added
    - Cannot due this because of authentication requirement

## Setup Vars

```
$acrName = 'mattmazzolaacr'
$repositoryName = 'cea'
$imageName = 'apps-announcement'
$imageVersion = '0.1.1'
$fullImageName = "${repositoryName}/${imageName}:${imageVersion}"
```

## Build Image

```
docker build -t $fullImageName .
```

## Run container Locally

```
docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL="https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json" `
    -e BASE_URL="https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod" `
    -e TEAM_NAME="Macrohard Microsoft" `
    -e MATCH_TIME="Saturday 11am PDT (UTC-7)" `
    $fullImageName
```

## Log in to Azure

```
az login
az account set -s 375b0f6d-8ad5-412d-9e11-15d36d14dc63
az account show --query name
```

## Push image to ACR

```
az acr build -r $acrName --image $fullImageName .
```

## Get image URL

```
$acrUrl = $(az acr show -n $acrName --query loginServer)
$acrImageName = "$($acrUrl)/$($fullImageName)"
```

## ACR password

```
$acrUsername = $(az acr credential show -n $acrName --query "username" -o tsv)
$acrPassword = $(az acr credential show -n $acrName --query "passwords[0].value" -o tsv)
```

## ACR Login

```
az acr login -n $acrName -u $acrUsername -p $acrPassword
```

## Run Image From ACR

```
docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL="https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json" `
    -e BASE_URL="https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod" `
    -e TEAM_NAME="Macrohard Microsoft" `
    -e MATCH_TIME="Saturday 11am PDT (UTC-7)" `
    $acrImageName
```

## Create Container App From Image
