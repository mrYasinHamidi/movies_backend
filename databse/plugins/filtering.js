module.exports = function filteringPlugin(schema) {
    schema.statics.filter = function (filters) {
        const query = {};

        for (let key in filters) {
            if (!filters[key]) continue;
            const schemaType = schema.path(key);

            if (schemaType) {
                if (schemaType.instance === 'String') {
                    query[key] = {$regex: filters[key], $options: 'i'};
                } else if (schemaType.instance === 'Number') {
                    query[key] = filters[key];
                } else if (schemaType.instance === 'Boolean') {
                    query[key] = filters[key] === 'true';
                } else if (schemaType.instance === 'Date') {
                    query[key] = new Date(filters[key]);
                }
            }
        }

        return query;
    };
};
