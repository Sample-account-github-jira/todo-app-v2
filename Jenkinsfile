pipeline
{
environment 
{
BUILD_HOME='/var/lib/jenkins/workspace'
}
agent any
stages {
    stage('Generic') {
      steps {
        checkout(
            changelog: false,
            poll: false,
            scm: [
              $class: 'GitSCM',
              branches: [
                [
                  name: '*/master'
                ]
              ],
              doGenerateSubmoduleConfigurations: false,
              extensions: [
                [
                  $class: 'RelativeTargetDirectory',
                  relativeTargetDir: './'
                ]
              ],
              submoduleCfg: [],
              userRemoteConfigs: [
                [
                  credentialsId: '309a1eda-5dc7-458e-8f6d-38f0d9678743',  
                  url: 'https://github.com/Sample-account-github-jira/Todo-Application'
                ]
              ]
          ])
    script 
          {
           inject_environment()
           inject_stage()
          }
}
}
}
}

def inject_environment()
{
env.deploy_qualys_scan_creds='qualys_scan_creds'
env.script_file='jenkins-qualys-poc-script.sh'
}

def inject_stage()
{
stage('Stage: Perform Backup') {
      catchError {
       withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "${deploy_qualys_scan_creds}" , usernameVariable: 'deploy_user', passwordVariable: 'deploy_password']]) {
        sh """
          sed -i "s/<% DEPLOY_USER %>/${deploy_user}/g" ${script_file}
          sed -i "s/<% DEPLOY_PASSWORD %>/${deploy_password}/g" ${script_file}
          chmod +x ${script_file}
          ./${script_file}
         """
      }
    }
}
}
