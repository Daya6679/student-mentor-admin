pipeline {
    agent any

    environment {
        APP_NAME = 'student-mentor-admin'
    }

    stages {

        stage('Install NodeJS & Verify') {
            steps {
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    node -v
                    npm -v
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npx playwright install'
                sh 'npm start & sleep 5 && npx playwright test --reporter=line && pkill -f "node index.js"'
            }
        }

        stage('Deploy with PM2') {
            steps {
                sh '''
                  pm2 describe students-app-3000 >/dev/null 2>&1 && pm2 delete students-app-3000 || echo "App not running"
                  pm2 start ecosystem.config.js --env production
                  pm2 save
                '''
            }
        }
    }
}
