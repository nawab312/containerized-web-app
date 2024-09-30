kubectl apply -f ./mysql_yml_files/mysql-pv.yml
sleep 1
kubectl apply -f ./mysql_yml_files/mysql-configmap.yml
sleep 1
kubectl apply -f ./mysql_yml_files/mysql-deployment.yml
sleep 1
kubectl apply -f ./mysql_yml_files/mysql-service.yml
sleep 1
kubectl apply -f ./webapp_yml_files/nodejs-deployment.yml
sleep 1
kubectl apply -f ./webapp_yml_files/nodejs-service.yml
