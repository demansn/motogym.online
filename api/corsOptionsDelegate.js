const allowlist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080', 'https://motogym-online-web-app.oa.r.appspot.com', 'https://studio.apollographql.com'];
export const corsOptionsDelegate = function (req, callback) {
    let corsOptions;

    console.log(req.header('Origin'));

    if (allowlist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response

    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

