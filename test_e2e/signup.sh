#! bin/bash
curl -sx POST http://localhost:3000/signup \
      -H "Content-Type: application: json" \
      -d `{"email": "test@test.com", "uname":"tester", "psw": "password123"}` | \
awk '/success: true/ {found=1} END {exit (found ? 0 : 1)}'


