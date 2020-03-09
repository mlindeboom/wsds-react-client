# web-socket-domain-security
The WebSocketDomainSecurity project uses web sockets to validate and register a browser session with a set of protected services. If the browser session is valid, access is granted to the protected services.  Validation of the browser session is accomplished through randomized shared secrets and requiring the browser to verify its domain. This project uses AWS Lambda, Step Functions, Node.js, DynamoDB and Cloudformation.



![Web Socket Domain Security](https://github.com/mlindeboom/wsds-react-client/blob/master/wsds-client.svg)


1. $connect - A browser client first connects to the WebSocket API. In the gateway, a connectionId value is generated that uniquely identifies this browser client. The wsdsConnect lambda function stores the value in the connectionsDB as a new entry. A stepfunction workflow is started by the wsdsConnect function.

2. connectionId - The websocket interface communicates the connectionId back to the browser client. The browser code should keep this value to use in subsequent calls.

3. sendExecutable - The websocket interface sends a payload containing a JavaScript function to the browser client for the browser to execute. The results of the function must be sent back through the interface in step 4.

4. onMessage - The browser execution results of the JavaScript function are sent back through the WebSocket interface to be analyzed by the wsdsVerificationResult lambda function. If the execution results match those expected by the lambda function, a pass indication is given to the waiting step function. The ConnectionValid path will call wsdsValidConnect which, in turn, updates the connectionDB to mark the connectionId as verified. The ConnectionInvalid step function path leaves the connectionId unmarked indicating it is not verified.

5. REST call with connectionId - Once the connectionId is verified through the websocket, REST calls can be made from the browser to the API Gateway resources protected by the wsdsAuthenticator. The REST call must have the connectionId in the request header. The wsdsAuthenticator uses the connectionId value to query the connectionsDB to see if the connectionId has been verified. Unverified connections get a 401 code returned. Requests using a verified connectionId are passed through to the protected resource. Note: the authenticator uses a default TTL of 5 minutes to cache the results of the current authentication. 

6. $disconnect - if the websocket becomes disconnected, the connectionId is removed from the connectionsDB.
