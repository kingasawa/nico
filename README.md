
geth -datadir ~/Library/geth22/ init ./sample_genesis.json
geth -datadir ~/Library/geth22/


#SYNCFAB Payment (SPS)
  Circulating Supply for CoinMarketCap
## Deployment
kubectl apply -f deployment.yml
## Service
kubectl apply -f service.yml
## Update service
  ```
  kubectl patch deployment payment -p \
  "{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
  ```
## Dev
### Start postgres
docker run -d --name payment -p 5435:5432 -e POSTGRES_DB=syncfab -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:9-alpine


