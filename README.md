# web-socket-domain-security
The WebSocketDomainSecurity project uses web sockets to validate and register a browser session with a set of protected services. If the browser session is valid, access is granted to the protected services.  Validation of the browser session is accomplished through randomized shared secrets and requiring the browser to verify its domain. 



![Web Socket Domain Security](https://github.com/mlindeboom/wsds-react-client/blob/master/wsds-client.svg)


1. $connect - A browser client first connects to the WebSocket API. 

2. connectionId - The websocket interface communicates the connectionId back to the browser client. The browser code should keep this value to use in subsequent calls.

3. sendExecutable - The websocket interface sends a payload containing a JavaScript function to the browser client for the browser to execute. The results of the function must be sent back through the interface in step 4.

4. onMessage - The browser execution results of the JavaScript function are sent back through the WebSocket interface to be analyzed 

5. REST call with connectionId - Once the connectionId is verified through the websocket, REST calls can be made from the browser.  The REST call must have the connectionId in the request header.  Unverified connections get a 401 code returned. Requests using a verified connectionId are passed through to the protected resource. 

6. $disconnect - if the websocket becomes disconnected.
