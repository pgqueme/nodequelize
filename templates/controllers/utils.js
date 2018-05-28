module.exports = {
    /**
     * Returns options received by the query to make a paginated search 
     * @param {*} req 
     */
    getSearchOptions(req){
        var options = {};
        options.limit = parseInt(req.query.limit) || 10;
        options.page = parseInt(req.query.page) || 1;
        options.offset = options.limit * (options.page - 1);
        options.orderBy = req.query.orderBy || 'id';
        options.direction = req.query.direction || 'DESC';
        options.field = req.query.field || 'any';
        options.value = req.query.value || '';
        return options;
    },
};