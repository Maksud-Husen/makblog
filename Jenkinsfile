pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Stop old containers") {
            steps {
                echo "Stopping old containers"
                sh '''
                docker compose down || true
                '''
            }
        }

        stage("Build & Run") {
            steps {
                echo "Building and starting containers"
                sh '''
                docker compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful ✅"
        }
        failure {
            echo "Deployment failed ❌"
        }
    }
}
