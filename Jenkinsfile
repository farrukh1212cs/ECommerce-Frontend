pipeline {
    agent any
	 options {
        disableConcurrentBuilds()
    }   
    stages {       

        stage('Build') {
            steps {
                sh 'docker build --no-cache -t ecom-front/ui -f Dockerfile .'
            }
        }
        stage('Push and Deploy') {
            steps {                
                sh 'docker stop ecom-front || true && docker rm ecom-front || true'
                sh 'docker run -d --restart always --name ecom-front --network zohan -p 9201:80 ecom-front/ui:latest'

            }
        }
    }
}