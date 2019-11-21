module.exports = {
    get({offset=0,limit=20}){
        return $.ajax({
            url:`/api/ajax/cinemaList?day=2019-10-11&offset=${offset}&limit=${limit}&districtId=-1&lineId=-1&hallType=-1&brandId=-1&serviceId=-1&areaId=-1&stationId=-1&item=&updateShowDay=true&reqId=1570801228490&cityId=1`
        })
    }
}