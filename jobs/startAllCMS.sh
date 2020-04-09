work_path=$(dirname $0)

fuser -k 9099/tcp

bash ${work_path}/startCMSUwsgi.sh

echo 'start all'
