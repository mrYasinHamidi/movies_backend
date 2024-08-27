module.exports = function selectingPlugin(schema) {
    schema.statics.selectFields = function (selectQuery) {
        if (!selectQuery) return '';

        return selectQuery.split(',').join(' ');
    };
};
