#!/usr/bin/env groovy

pipeline {
    agent any

    stages {
        stage('Checkout Source') {
            steps {
                script {
                    try {
                        notifyBuild('STARTED')
                        checkout scm
                    } catch (e) {
                        // If there was an exception thrown, the build failed
                        currentBuild.result = "FAILED"
                        throw e
                    }
                }
            }
        }
    
        stage('ENV Test') {
            steps {
                script {
                    try {
                        sh "chmod +x gradlew"
                        sh "./gradlew clean --no-daemon"
                        sh "./gradlew checkstyleNohttp --no-daemon"
                        sh "./gradlew -Pprod -Pwar clean bootWar"
                        sh "./gradlew test integrationTest jacocoTestReport"

                    } catch (e) {
                        // If there was an exception thrown, the build failed
                        currentBuild.result = "FAILED"
                        throw e
                    }
                }
            }
        }
    
        stage('Pushing Image') {
            environment {
                registryCredential = 'dockerhublogin'
            }
            steps{
                script {
                    try {
                        docker.withRegistry( 'https://registry.hub.docker.com', registryCredential ) {
                            sh './gradlew bootJar -Pprod jib -Djib.to.image=antphungit/gateway'
                        }
                    } catch (e) {
                        // If there was an exception thrown, the build failed
                        currentBuild.result = "FAILED"
                        throw e
                    }
                }
            }
        }

        stage('Deploying Services to Kubernetes Cluster') {
            steps {
                script {
                    try {
                        kubernetesDeploy(configs: "sam-deployment.yml", kubeconfigId: "kubernetes-samhello")
                    } catch (e) {
                        // If there was an exception thrown, the build failed
                        currentBuild.result = "FAILED"
                        throw e
                    } finally {
                        // Success or failure, always send notifications
                        notifyBuild(currentBuild.result)
                    }
                }
            }
        }
    }
}

def notifyBuild(String buildStatus = 'STARTED') {
    // Build status of null means success.
    buildStatus = buildStatus ?: 'SUCCESS'

    def color

    if (buildStatus == 'STARTED') {
        color = 'good'
    } else if (buildStatus == 'SUCCESS') {
        color = 'good'
    } else if (buildStatus == 'UNSTABLE') {
        color = 'warning'
    } else {
        color = 'danger'
    }

    def msg = "${buildStatus}: `${env.JOB_NAME}` #${env.BUILD_NUMBER}:\n${env.BUILD_URL}display/redirect"

    slackSend(color: color, message: msg)
    
}
