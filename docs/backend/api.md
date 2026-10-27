# [/api/v1](#/api/v1)

* [/:endpoint](#any-/api/v1/-endpoint)
* [/auth](#/api/v1/auth)
	* [POST /signup](#post-/api/v1/auth/signup)
	* [POST /login](#post-/api/v1/auth/login)
* [/user](#api/v1/user)
	* [GET /user/:userId](#get-/api/v1/user/-userid)
	* [PATCH /user/:userId](#patch-/api/v1/user/-userid)
	* [DELETE /user/:userId](#delete-/api/v1/user/-userid)
* [/chats](#/api/v1/chats)
	* [GET /chats](#get-/api/v1/chats)
	* [POST /chats](#post-/api/v1/chats)
	* [DELETE /chats](#delete-/api/v1/chats/)
		* [GET /:chatId](#get-/api/v1/chats/-chatid)
		* [PATCH /:chatId](#patch-/api/v1/chats/-chatid)
			* [GET /messages](#get-/api/v1/chats/-chatid/messages)
			* [POST /messages](#post-/api/v1/chats/-chatid/messages)

# ENDPOINTS:

## ANY /api/v1/:endpoint
	quick redirects for other endpoints,
	eg. /login redirets/alias for /auth/login
## /api/v1/auth
### POST /api/v1/auth/signup
	DESCRIPTION: signup endpoint
	METHOD: POST
	URL: /api/v1/auth/signup`
	PAYLOAD:
		`{
		"email": string,
		"password": string,
		"username": string,
		"first_name": string,
		"last_name": string
		}`
	RETURN:
		`{
			response: 'Account creation successful'
		}`
### POST /api/v1/auth/login
	DESCRIPTION: login endpoint
	METHOD: POST
	URL: /api/v1/auth/login`
	PAYLOAD:
		`{
		"email": string
		"password": string
		}`
	RETURN:
		`{
			"access_token": string/jwt
		}`

## api/v1/user
### GET /api/v1/user/:userId
	STATUS: UNIMPLEMENTED
	DESCRIPTION: fetch user details
	METHOD: GET
	URL: /api/v1/user/:userId`
	PAYLOAD: NONE
	RETURN: return dependent on identity
		GUEST: ?
		USER: ?
		FRIEND: ?
		SELF: ?
### PATCH /api/v1/user/:userId
	STATUS: UNIMPLEMENTED
	DESCRIPTION: update account details
	METHOD: PATCH
	URL: /api/v1/user/:userId`
	PAYLOAD: ?
	RETURN: ?
### DELETE /api/v1/user/:userId
	STATUS: UNIMPLEMENTED
	DESCRIPTION: delete user account
	METHOD:
	URL: /api/v1/user/:chatId`
	PAYLOAD: ?
	RETURN: ?

## /api/v1/chats
### GET /api/v1/chats
	DESCRIPTION: retrive all chats for a logged in user
	METHOD: GET
	URL: /api/v1/chats
	PAYLOAD: NONE
	RETURN:
		`Array<{
			"id": string,
			"title": string,
			"type":  string/enum(DIRECT|GROUP),
			"members": Array<string>
			"created_at": Date/ISOString,
			"joined_at": Date/ISOString,
			"last_read_message_id": string | null,
		}>`
### POST /api/v1/chats
	DESCRIPTION: create a new chat
	METHOD: POST
	URL: /api/v1/chats`
	PAYLOAD:
		`{
			"title": string,
			"type":  string/enum(DIRECT|GROUP),
			"members": Array<string>
		}`
	RETURN:
	`{
		"success": "Chat created"
	}`
### DELETE /api/v1/chats/
	STATUS: UNIMPLEMENTED
	DESCRIPTION: delete chat (most likely just leave chat, not sure about dms)
	METHOD: DELETE
	URL: /api/v1/chats/`
	PAYLOAD:
	`{
		chatId: string
	}`
	RETURN: ?
### /api/v1/chats/:chatId
#### GET /api/v1/chats/:chatId
	DESCRIPTION: get details of a chat (title, members)
	METHOD: GET
	URL: /api/v1/chats/:chatId`
	PAYLOAD: NONE
	RETURN:
		`{
			"id": string,
			"title": string,
			"type":  string/enum(DIRECT|GROUP),
			"members": Array<string>
			"created_at": Date/ISOString,
			"joined_at": Date/ISOString,
			"last_read_message_id": string | null,
		}`
#### PATCH /api/v1/chats/:chatId
	STATUS: UNIMPLEMENTED
	DESCRIPTION: update chat details, (rename, add/remove members)
	METHOD: PATCH
	URL: /api/v1/chats/:chatId`
	PAYLOAD: ?
	RETURN: ?
#### /api/v1/chats/:chatId/messages
##### GET /api/v1/chats/:chatId/messages
	DESCRIPTION: retive messages from a chat, with limiting
	METHOD: GET
	URL: /api/v1/chats/:chatId/messages`
	PAYLOAD: NONE
	RETURN:
		`{
			messages: Array<
				chat_Id: string,
				sender_id: string,
				body: string
			>]
		}`
##### POST /api/v1/chats/:chatId/messages
	DESCRIPTION: send message to chat
	METHOD: POST
	URL: /api/v1/chats/:chatId/messages`
	PAYLOAD:
		`{
		"body": string
		}`
	RETURN:
		`{
			"success": "message sent"
		}`

