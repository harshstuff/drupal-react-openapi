#!/bin/bash
# This deployment script is Drupal 8/9 Specific 

# -----------
# Requirements
# -----------
# - There should be a current live release to copy settings and files
# - TARGET_FOLDER environment varibale value must be set prior to running the script

####################################
# Checking if TARGET_FOLDER is set
####################################
echo $TARGET_FOLDER
if [[ -z $TARGET_FOLDER ]]; then
    echo "TARGET_FOLDER is not set, exiting the deployment script..";
    exit 1
fi

####################################
# Checking existing live release 
# LR = LIVE RELEASE
####################################
LR_FILES_DIR=/var/www/$TARGET_FOLDER/sites/default/files
LR_SETTINGS_FILE=/var/www/$TARGET_FOLDER/sites/default/settings.php

if [[ ! -d "$LR_FILES_DIR" ]] || [[ ! -f "$LR_SETTINGS_FILE" ]]; then
    echo "Unable to locate required live release files, exiting the deployment script.."
    exit 1
fi

####################################
# Variables |  RP = RELEASE PACKAGE
####################################

# declare a unique name for the zip package - must match sftp script
#PACKAGE_NAME="release_${BITBUCKET_BUILD_NUMBER}.zip";
PACKAGE_NAME="release.zip"
#TEMP_DIR="release_${BITBUCKET_DEPLOYMENT_ENVIRONMENT}_${BITBUCKET_BUILD_NUMBER}";
TEMP_DIR="temp"

WORKING_DIR=/home/ubuntu/$TEMP_DIR
RP_SETTINGS_FILE=./sites/default/settings.php
RP_LOCAL_SETTINGS_FILE=./sites/default/settings.local.php
RP_SERVICES_FILE=./sites/default/services.yml 
RP_FILES_DIR=./sites/default/files
RP_CONFIG_DIR=./config/sync



####################################
# create a temp working directory
####################################
if [[ -d "$WORKING_DIR" ]]; then
    rm -rf $WORKING_DIR
fi
mkdir $WORKING_DIR

# move package to working directory
mv /home/ubuntu/$PACKAGE_NAME $WORKING_DIR/

cd $WORKING_DIR
unzip -q ./$PACKAGE_NAME

rm ./$PACKAGE_NAME

####################################
# cleanup 
####################################

# environment specific files that exist in the release package
if [[ -f "$RP_SETTINGS_FILE" ]]; then
    rm $RP_SETTINGS_FILE
fi

if [[ -f "$RP_LOCAL_SETTINGS_FILE" ]]; then
    rm $RP_LOCAL_SETTINGS_FILE
fi

if [[ -f "$RP_SERVICES_FILE" ]]; then
    rm $RP_SERVICES_FILE
fi

# files directory
rm -rf $RP_FILES_DIR

# config sync directory
rm -rf $RP_CONFIG_DIR

# check for db files in the directory
count=`ls -1 *.sql 2>/dev/null | wc -l`
if [ count != 0 ]; then
    rm *.sql
fi


####################################
# move the production version of services.yml to active duty 
####################################
mv ./sites/default/services.yml.prod $RP_SERVICES_FILE

####################################
# copy the files and settings across from the current live release
####################################
sudo cp -r $LR_FILES_DIR $RP_FILES_DIR
sudo cp $LR_SETTINGS_FILE $RP_SETTINGS_FILE

####################################
# fix permissions
####################################
sudo fix-permissions.sh --drupal_path=$WORKING_DIR --drupal_user=www-data --httpd_group=ubuntu
sudo chmod 770 ./vendor/drush/drush/drush

####################################
# put the site into maintenance mode, trying to fix runaway memory issues
# not sure if this will help, might help to close out existing processes
####################################
/var/www/$TARGET_FOLDER/vendor/drush/drush/drush state:set system.maintenance_mode 1 --input-format=integer
/var/www/$TARGET_FOLDER/vendor/drush/drush/drush cr

sudo rm -rf /var/www/$TARGET_FOLDER
sudo mv $WORKING_DIR /var/www/$TARGET_FOLDER

####################################
# switch off maintenance mode
####################################
/var/www/$TARGET_FOLDER/vendor/drush/drush/drush state:set system.maintenance_mode 0 --input-format=integer
/var/www/$TARGET_FOLDER/vendor/drush/drush/drush cr

