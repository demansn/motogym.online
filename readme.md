## Как запусить dashbord
#### необходисо запустить api сервер, выполнив коммануд
```npm run dev-api```
```npm run start-dashboard ```

## Настройка локального окружения для разработки


mongorestore --drop --uri=mongodb://127.0.0.1:27017 --db=motogym motogym-db-may-10-backup/motogym

mongorestore --authenticationDatabase=admin --drop -u=apibot -p=d7fcE57Gda mongodb://bkcxxj39.mongo.tools:10036 --db=motogym  motogym-db-may-10-backup/motogym
