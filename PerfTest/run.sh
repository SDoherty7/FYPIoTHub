echo express >> results.txt ;
node expressserver.js & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f expressserver ;
sleep 5 

echo hapi >> results.txt ;
node hapiserver.js & sleep 5 ;
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f hapiserver ;
sleep 5 

echo node >> results.txt ;
node nodeserver.js & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f nodeserver ;
sleep 5 

echo koa >> results.txt ;
node koaserver.js & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f koaserver ;
sleep 5 

echo flatiron >> results.txt ;
node flatironserver.js & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f flatironserver ;
sleep 5 

javac javaserver.java

echo java >> results.txt ;
java javaserver & sleep 5 ; 
ab -k -n 50000 -c 100 -t 20 http://127.0.0.1:8000/ | grep "Requests per second:" >> results.txt ;
pkill -f javaserver ;
sleep 5 