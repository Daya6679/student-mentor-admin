pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        APP_NAME = 'student-mentor-admin'
    }

    stages {

        stage('Verify Node & NPM') {
            steps {
                sh 'node -v'
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
                sh 'npm run build || echo "No build step"'
            }
        }

        stage('Deploy with PM2') {
            steps {
                sh '''
                  pm2 describe $APP_NAME >/dev/null 2>&1 || \
                  pm2 start index.js --name student-mentor-admin 

                  pm2 restart student-mentor-admin
                  pm2 save
                '''
            }
        }
    }
}
