
node nodeserver.js & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ 
pkill -f nodeserver ;
sleep 5 