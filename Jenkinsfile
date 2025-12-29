pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    stages {

        stage('Checkout (CI)') {
            steps {
                git branch: 'main',
                    urlpipeline {
    agent any

    tools {
        NodeJS 'NodeJS'
    }

    stages {
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
                  pm2 restart student-mentor-admin || \
                  pm2 start index.js --name student-mentor-admin
                  pm2 save
                '''
            }
        }
    }
}
: 'https://github.com/<Daya6679>/<https://github.com/Daya6679/student-mentor-admin.git>.git'
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
