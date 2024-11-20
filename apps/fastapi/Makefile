img:=fastapi
tag:=v4.1
user:=poridhi
name:=api-container

build:
	docker build --platform linux/amd64 -t ${user}/${img}:${tag} .

run:
	docker run --platform linux/amd64 --name ${name} -d -p 8000:8000 ${user}/${img}:${tag}

push:
	docker push ${user}/${img}:${tag}

clean:
	docker stop ${name}
	docker rm ${name}