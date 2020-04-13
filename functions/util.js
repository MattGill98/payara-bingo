exports.secure = function(func) {
    return function(data, context) {
        if (context.auth.token.admin !== true) {
            return {
                error: "Request not authorized. User must be an admin to promote another admin"
            };
        };
        return func(data, context);
    };
}