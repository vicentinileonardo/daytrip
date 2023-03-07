FROM nginx:stable

# Copy the static HTML files to the appropriate directory
COPY ./templates /usr/share/nginx/html
COPY ./css /usr/share/nginx/html/css
COPY ./js /usr/share/nginx/html/js

# Copy the Nginx configuration file to the appropriate directory
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose the default HTTP and HTTPS ports
EXPOSE 80
EXPOSE 443

# Start the Nginx service and keep it running in the background
CMD ["nginx", "-g", "daemon off;"]
