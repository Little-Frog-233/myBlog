work_path=$(dirname $0)

fuser -k 9090/tcp

bash ${work_path}/startWebUwsgi.sh

echo 'start all'
