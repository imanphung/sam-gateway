#!/usr/bin/env groovy

pipeline {
    agent any

    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }
    
        stage('ENV Test') {
            steps {
                sh "chmod +x gradlew"
                sh "./gradlew clean --no-daemon"
                sh "./gradlew checkstyleNohttp --no-daemon"
            }
        }
    
        stage('Pushing Image') {
            environment {
                registryCredential = 'dockerhublogin'
            }
            steps{
                script {
                    docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                        sh './gradlew bootJar -Pprod jib -Djib.to.image=antphungit/gateway'
                    }
                }
            }
        }

        stage('Deploying Services to Kubernetes Cluster') {
            steps {
                script {
                    kubernetesDeploy(configs: "sam-deployment.yml", kubeconfigId: "kubernetes-samhello")
                }
            }
        }
    }
}
