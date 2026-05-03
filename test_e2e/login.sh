#! bin/bash


curl -sx http://localhost:3000/login \
      -d "Content-Type: application/json" \
      -H `{"email": "test@test.com", "psw": "password123"}`| \
awk '/succes: true/ {found = 1} /token:/ {token}'
