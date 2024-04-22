# 1 - Introduction

Introduce how to handle error in this microservices

you should **import** **@noqclinic/common** library to use all the error handler. 

If you want create new error type, please create it in the `2000-common` folder



# 2 - Existing Error Handler

### 2.1 - BadRequestError

~~~ts
throw new BadRequestError("string will return to response")
~~~

A "Bad Request" error, signified by the HTTP status code 400, means that the request sent by the client to the server is incorrect or corrupted and the server can't understand it. This could be due to malformed syntax, incorrect data formatting, invalid headers, or URL encoding issues. It's the server's way of saying it can't process the request unless the client modifies it to match the expected format. To resolve this, clients must check the request against the server's specifications and correct any discrepancies in the URL, headers, or body of the request.

### 2.2 - DatabaseConnectionError

~~~typescript
throw new DatabaseConnectionError()
~~~

A DatabaseConnectionError occurs when a program or application is unable to establish a connection with a database. This error can occur due to various reasons such as network issues, incorrect credentials, database server problems, or insufficient permissions. When encountered, it prevents the program from accessing or retrieving data from the database, disrupting the functionality of the application or system that relies on the database for its operations. Resolving this error typically involves troubleshooting the connection settings, ensuring the database server is running, verifying credentials, and addressing any network issues.

### 2.3 - NotAuthorizedError

~~~typescript
throw new NotAuthorizedError()
~~~

A NotAuthorizedError typically occurs in software systems or applications when a user attempts to access or perform an operation for which they do not have the necessary permissions or authorization. This error signifies that the user's credentials or permissions are not sufficient to carry out the requested action, and it is commonly encountered in systems with role-based access control (RBAC) or similar authorization mechanisms. When faced with a NotAuthorizedError, users are typically denied access to the resource or functionality they were attempting to use, and they may need to contact an administrator or request appropriate permissions to resolve the issue.

### 2.4 - NotFoundError

~~~bash
throw new NotFoundError()
~~~

A NotFoundError occurs in software systems or applications when a requested resource or entity cannot be found within the system. This error typically indicates that the system searched for a specific object, file, record, or URL but was unable to locate it. NotFoundError can occur due to various reasons, such as mistyped URLs, deleted or moved files, database records that do not exist, or invalid references to objects within the system. When encountered, this error may result in a 404 HTTP status code being returned to the user, indicating that the requested resource could not be found. Resolving NotFoundError often involves troubleshooting the request to ensure that the requested resource exists and is accessible within the system.

### 2.5 - RequestValidationError

Check validate-request middleware for details, we will use that one directly



### 2.6 - Create Custom Error Type

Here is the way to create Custom Error Type

`2000-common/src/errors/example-error.ts`

~~~typescript
import { CustomError } from "./custom-error";

// extends CutomError and implement inherited abstract class (use quick fix)
export class ExampleError extends CustomError {
    // define a status code
    statusCode: number = 999;
    // define a constructor if parameter need pass to the error
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }
    
    // this function serialize the error output for error handler in the middleware
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        // implemente
        return [{message: "example error type"}]
    }    
}
~~~





