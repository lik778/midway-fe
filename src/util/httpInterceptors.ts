export const httpInterceptors = ( cb?: (params: any) => void ) => {
    return async function (req, res, next) {
        console.log(req.ip)
        cb && cb(req.ip)
        next();
    }
}

