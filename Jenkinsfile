pipeline {
    agent any

    tools {
        NodeJS 'NodeJS'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'node -v'
                sh 'npm -v'
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
                  pm2 restart student-mentor-admin || \
                  pm2 start index.js --name student-mentor-admin
                  pm2 save
                '''
            }
        }
    }
}

