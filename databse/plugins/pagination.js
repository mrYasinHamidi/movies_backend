module.exports = function paginationPlugin(schema) {
    schema.statics.paginate = async function (query, page = 1, limit = 10) {
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const total = await this.countDocuments(query);
        const data = await this.find(query).skip(skip).limit(parseInt(limit, 10));

        return {
            data,
            total,
            currentPage: parseInt(page, 10),
            totalPage: Math.ceil(total / parseInt(limit, 10)),
        };
    };
};
