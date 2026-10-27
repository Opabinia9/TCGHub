Login:
curl http://100.90.100.12:8080/api/v1/auth/login -H 'Content-Type: application/json' -H 'Authorization: Bearer $JWT_TOKEN' -X POST -d '{"email": "bgtfraser@gmail.com", "password": "password1"}'
Output:
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTFiYmM2MS02MGZlLTQ4OGItOGViNS1mMDE4MTk4ZWM1ZWEiLCJpYXQiOjE3OTMwODUyMzh9.nlmMgLvQ_sLs79c20vygpsqh0d0O-gfyFmWQF_l1G3I"}%
Success: t

Verified Login
curl http://100.90.100.12:8080/api/v1/auth/protected -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X GET
Output:
{"response":"verified and logged in"}%
Success: t

Create Deck
curl http://100.90.100.12:8080/api/v1/decks/ -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X POST -d '{"deck_name": "newdeck"}'
Output:

Success: t

Get Decks:
curl http://100.90.100.12:8080/api/v1/decks/ -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X GET
Output:
[{"id":"1268c369-139d-4bda-ab30-1b574d404390","owner_id":"891bbc61-60fe-488b-8eb5-f018198ec5ea","deck_name":"newdeck"}]%
Success: t

Update Deck
curl http://100.90.100.12:8080/api/v1/decks/1268c369-139d-4bda-ab30-1b574d404390/cards/ -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X PATCH -d '{"deck_name": "twodeck"}'
Output:
{"id":"1268c369-139d-4bda-ab30-1b574d404390","owner_id":"891bbc61-60fe-488b-8eb5-f018198ec5ea","deck_name":"twodeck"}%
Success: t

Delete Deck
curl http://100.90.100.12:8080/api/v1/decks/fc7f594d-3734-43f0-9b87-69309c46ba38/cards/ -H "Authorization: Bearer $JWT_TOKEN" -X DELETE
Output:

Success: t

Search Cards:
curl http://100.90.100.12:8080/api/v1/cards\?name\=sol+ring -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" | jq
Output:
JSON monolith > sol ring id: 234f3d24-3ab7-4124-8f35-2cd437b786f3
Success: t

Add DeckCard
curl http://100.90.100.12:8080/api/v1/decks/1268c369-139d-4bda-ab30-1b574d404390/cards/234f3d24-3ab7-4124-8f35-2cd437b786f3 -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X POST -d '{"quantity": 1}'
Output:
{"deck_id":"1268c369-139d-4bda-ab30-1b574d404390","card_id":"234f3d24-3ab7-4124-8f35-2cd437b786f3","quantity":1}%
Success: t

Update DeckCard
curl http://100.90.100.12:8080/api/v1/decks/1268c369-139d-4bda-ab30-1b574d404390/cards/234f3d24-3ab7-4124-8f35-2cd437b786f3 -H 'Content-Type: application/json' -H "Authorization: Bearer $JWT_TOKEN" -X PATCH -d '{"quantity": 5}'
Output:
{"deck_id":"1268c369-139d-4bda-ab30-1b574d404390","card_id":"234f3d24-3ab7-4124-8f35-2cd437b786f3","quantity":10}%
Success: t

Delete DeckCard
curl http://100.90.100.12:8080/api/v1/decks/1268c369-139d-4bda-ab30-1b574d404390/cards/234f3d24-3ab7-4124-8f35-2cd437b786f3 -H "Authorization: Bearer $JWT_TOKEN" -X DELETE
Output:

Success: t

