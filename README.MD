# Drupal Docker THQ

1. You must copy `env.default` to `.env` and change the TAG to reflect the project name.

2. Then change other environment variables according to the requirements (might need to change the Drupal version).
3. connect to the php container and run the following command
   ```
   chown -R www-data:www-data web/sites web/modules web/themes;
   ``` 

## commands

### Backup
```
drush sql:dump > backup.sql
```

```
docker exec mysql /usr/bin/mysqldump -u root --password=root drupal > backup.sql
```
#### if you get a socket connection error, go to project root and run: 
```
mysqldump --column-statistics=0 --protocol=tcp -u root -proot drupal > db_exports/backup.sql
```

### Restore

```
cat backup.sql | docker exec -i mysql /usr/bin/mysql -u root --password=root drupal
```
```
drush sql-cli < ~/my-sql-dump-file-name.sql
```
