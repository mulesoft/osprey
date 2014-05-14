How to create a SSL certificate
======

You can generate a certificate with the [OpenSSL](http://www.openssl.org/) kit like so:

1. Generate the private key.   
  `openssl genrsa -des3 -out server.key 1024`
2. Generate the CSR (certificate signing request). 
  `openssl req -new -key server.key -out server.csr`
3. Generate the self signed certificate. 
  `openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt`