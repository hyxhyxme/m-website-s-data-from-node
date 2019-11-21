module.exports = {
    get({cinemaId='27824'}){
        return $.ajax({
            url:`/api/ajax/cinemaDetail?cinemaId=${cinemaId}`,
        })
    }
}