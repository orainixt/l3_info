import { readFile } from "fs";

function handleRequest(request,response){
    if(request.url == '/' || request.url == '/index'){
        responseWithFile(response, "public/html/index.html", "text/html", 200);
    } else if (request.url === "/about"){
        responseWithFile(response, "public/html/about.html", "text/html", 200)
    } else if (request.url === "/admin"){
        responseWithFile(response, "public/html/admin.html", "text/html", 200);
    } else if (request.url === "/votant"){
        responseWithFile(response, "public/html/voter.html", "text/html", 200);
    } else if (request.url.startsWith("/scripts")) {
        responseWithFile(response, `public/${request.url}`, "application/javascript", 200);
    } else if (request.url === "/favicon.ico"){
        response.writeHead(204); 
        response.end();
    } else if (request.url.startsWith("/utils/style")) {
        responseWithFile(response, `public/${request.url}`, "text/css", 200);
    } else {
        responseWithFile(response, "public/html/error.html", "text/html", 404);
    }
}

function responseWithFile(response, filePath, contentType,returnCode){
    const fullPath = "./".concat(filePath); 
    readFile(fullPath, (_,data) => {
        response.writeHead(returnCode, {"Content-Type": contentType});
        response.end(data);
    });
}

export default handleRequest;