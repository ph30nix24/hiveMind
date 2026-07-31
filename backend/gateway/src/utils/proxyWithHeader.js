import proxy from 'express-http-proxy'

export const proxyWithHeader =  (sourceUrl) => {
    return proxy(sourceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if(srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user._id
            } 
            return proxyReqOpts
        }
    })
}

export const plainProxy = (sourceUrl) => {
    return proxy(sourceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if(srcReq.cookies.session) {
                proxyReqOpts.headers["x-cookie-session"] = srcReq.cookies.session
            }
            return proxyReqOpts
        }
    })
}