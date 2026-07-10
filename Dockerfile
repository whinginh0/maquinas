FROM nginx:alpine

# Copia a página de vendas (pasta raiz servida pelo nginx)
COPY pagina-de-vendas/ /usr/share/nginx/html/

# Copia a área de membros para um subdiretório
COPY area-de-membros/ /usr/share/nginx/html/area-de-membros/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
