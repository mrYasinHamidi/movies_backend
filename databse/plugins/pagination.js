module.exports = function paginationPlugin(schema) {
    schema.statics.paginate = async function (query, page = 1, limit = 10) {
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        console.log(query, page, limit);
        const total = await this.countDocuments(query);
        const results = await this.find(query).skip(skip).limit(parseInt(limit, 10));

        return {
            results,
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / parseInt(limit, 10)),
        };
    };
};
