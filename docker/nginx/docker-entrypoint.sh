#!/bin/sh
cp /nginx.conf /etc/nginx/nginx.conf
echo "FRONTEND PORT: $FRONTEND_PORT"
echo "BACKEND PORT: $BACKEND_PORT"
envsubst '$FRONTEND_PORT $BACKEND_PORT' < /nginx.conf > /etc/nginx/nginx.conf
echo "Echoing nginx.conf"
cat /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'