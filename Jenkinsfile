pipeline {
    agent any

    tools {
        nodejs 'NodeJS 18'
    }

    environment {
        APP_NAME = 'student-mentor-admin'
    }

    stages {

        stage('Verify Node & NPM') {
            steps {
                sh 'echo "Node version:"'
                sh 'node -v'
                sh 'echo "NPM version:"'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build || echo "No build step found"'
            }
        }

        stage('Deploy with PM2') {
            steps {
                sh '''
                  pm2 describe $APP_NAME >/dev/null 2>&1 || \
                  pm2 start index.js --name $APP_NAME

                  pm2 restart $APP_NAME
                  pm2 save
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully'
        }
        failure {
            echo '❌ Deployment failed – check logs above'
        }
    }
}
