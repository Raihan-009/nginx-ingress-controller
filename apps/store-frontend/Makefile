img:=store-app
tag:=v2.1
user:=poridhi
name:=fe-container

build:
	docker build --platform linux/amd64 -t ${user}/${img}:${tag} .

run:
	docker run --platform linux/amd64 --name ${name} -d -p 3000:3000 ${user}/${img}:${tag}

push:
	docker push ${user}/${img}:${tag}

clean:
	docker stop ${name}
	docker rm ${name}