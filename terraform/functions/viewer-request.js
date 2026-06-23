function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;

    if (host === "www.3d-projection-lab.com") {
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                location: { value: "https://3d-projection-lab.com" + request.uri }
            }
        };
    }

    return request;
}