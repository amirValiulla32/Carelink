# Carelink

**Carelink** is a small desktop app that helps caregivers keep gentle, private notes about each day with a loved one who has dementia.

for creating the local db for api/testing: 
```bash
sqlcipher carelink_enc.db
PRAGMA key = 'dev-pin-7864';
.read schema.sql
