module.exports = function sortingPlugin(schema) {
    schema.statics.sorting = function (sortQuery) {
        if (!sortQuery) return {};

        const sort = {};
        const sortFields = sortQuery.split(',');

        sortFields.forEach((field) => {
            const order = field.startsWith('-') ? -1 : 1;
            const key = field.replace('-', '');
            sort[key] = order;
        });

        return sort;
    };
};
