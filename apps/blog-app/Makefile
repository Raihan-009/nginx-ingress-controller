img:=blog-app
tag:=1.7
repo:=poridhi
name:=blog-container

build:
	docker build --platform linux/amd64 -t ${repo}/${img}:${tag} .

run:
	docker run -p 3001:80 --name ${name} ${repo}/${img}:${tag}

push:
	docker push ${repo}/${img}:${tag}

clean:
	docker stop ${name}
	docker rm ${name}
