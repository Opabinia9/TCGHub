# [/api/v1](#apiv1)

* [/:endpoint](#anyapiv1endpoint)
* [/auth](#apiv1auth)
	* [POST /signup](#posta-piv1authsignup)
	* [POST /login](#posta-piv1authlogin)
* [/user](#apiv1user)
	* [GET /user/:userId](#geta-piv1useruserid)
	* [PATCH /user/:userId](#patcha-piv1useruserid)
	* [DELETE /user/:userId](#deletea-piv1useruserid)
* [/chats](#apiv1chats)
	* [GET /chats](#geta-piv1chats)
	* [POST /chats](#posta-piv1chats)
	* [DELETE /chats](#deletea-piv1chats)
		* [GET /:chatId](#geta-piv1chatschatid)
		* [PATCH /:chatId](#patcha-piv1chatschatid)
			* [GET /messages](#geta-piv1chatschatidmessages)
			* [POST /messages](#posta-piv1chatschatidmessages)

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

