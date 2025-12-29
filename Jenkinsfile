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
                sh '''
                    npx playwright install
                    npx playwright install-deps
                    npm start &
                    SERVER_PID=$!
                    sleep 10
                    npx playwright test --reporter=line
                    TEST_EXIT=$?
                    kill $SERVER_PID
                    exit $TEST_EXIT
                '''
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
