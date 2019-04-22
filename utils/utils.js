module.exports = {
    sendErrorMessage: function(res, message) {
        res.json({success: false, message: message});
    },

    sendSuccessMessage: function(res, data) {
        res.json({success: true, data: data});
    },

    areNonEmpty: function() {
        for(let i = 0; i < arguments.length; i++) {
            const row_valid = arguments[i] && arguments[i].trim();
            if (!row_valid) return false;
        }

        return true;
    }
}