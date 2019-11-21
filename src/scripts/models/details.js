module.exports = {
    get({id=1230121}){
        return $.ajax({
            url:`/api/ajax/detailmovie?movieId=${id}`,
        })
    }
}