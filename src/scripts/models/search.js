module.exports = {
    get({kw = '我'}){
        return $.ajax({
            url:`/api/ajax/search?kw=${kw}&cityId=194&stype=-1`,
            
        })
    }
}