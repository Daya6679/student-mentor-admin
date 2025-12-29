pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    stages {

        stage('Checkout (CI)') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/<Daya6679>/<https://github.com/Daya6679/student-mentor-admin.git>.git'
            }
        }

        stage('Install Dependencies (CI)') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy (CD)') {
            steps {
                sh '''
                echo "Starting deployment..."
                pm2 delete all || true
                pm2 start ecosystem.config.js
                pm2 save
                '''
            }
        }
    }
}
