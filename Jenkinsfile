pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        
        stage("change .env") {
            steps {
                echo 'Changing .env'
            script {
                if (fileExists('.env.example')) {
                    sh 'cp .env.example .env'
                } else {
                    echo '.env.example not found, skipping .env creation'
                }
            }
        }

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Stop old containers") {
            steps {
                echo "Stopping old containers"
                sh '''
                docker stop blog-backend blog-frontend blog-db
                docker rm blog-backend blog-frontend blog-db
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
