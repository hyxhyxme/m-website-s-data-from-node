module.exports = {
    get({offset = 0}){
        return $.ajax({
            url:`/api/ajax/mostExpected?ci=1&limit=10&offset=${offset}&token=`,
        })
    }
}