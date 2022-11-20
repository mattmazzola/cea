# CEA SC2 Announcement Generator

```
docker build -t cea-announcement .
```

```
docker run --rm -it `
    -p 8080:8080 `
    -e MAPS_URL="https://cea-assets.s3.amazonaws.com/sc2/map-lineups/corporate.json" `
    -e BASE_URL="https://1ebv8yx4pa.execute-api.us-east-1.amazonaws.com/prod" `
    -e TEAM_NAME="Macrohard Microsoft" `
    -e MATCH_TIME="Saturday 11am PDT (UTC-7)" `
    cea-announcement
```
