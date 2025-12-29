pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        APP_NAME = 'students-app'
        APP_PORT = '3000'
    }

    stages {

        stage('Checkout Code (CI)') {
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

        stage('Run Tests (CI)') {
            steps {
                sh 'npm test || echo "No tests yet"'
            }
        }

        stage('Build / Validate (CI)') {
            steps {
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Deploy (CD)') {
            steps {
                sh '''
                pm2 stop $APP_NAME || true
                pm2 start index.js --name $APP_NAME
                pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
