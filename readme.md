
#### **Backup Command:**
Run the following command to create a backup of the database from the running PostgreSQL container:

```sh
docker exec -t <container_name> pg_dump -U <db_user> <db_name> > backup.sql
```
- Replace `<container_name>` with the name of **PostgreSQL container** (check using `docker ps`).
- Replace `<db_user>` and `<db_name>` with the **database username** and **database name**.
- The backup file will be saved as `backup.sql` in current directory.

#### **Restore Command:**
If needed, restore the database using:

```sh
cat backup.sql | docker exec -i <container_name> psql -U <db_user> -d <db_name>
```

---
