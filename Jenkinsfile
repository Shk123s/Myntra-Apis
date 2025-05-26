pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repo...'
               
            }
        }

        stage('Build') {
            steps {
                echo 'Building the app...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
               
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app...'
               
            }
        }
    }
}
