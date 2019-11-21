module.exports = {
    get({id=1230121,time='2019-10-18',reqId='1571295174117'}){
        return $.ajax({
            type:'POST',
            url:`/api/ajax/movie?forceUpdate=${reqId}`,
            data:{
                movieId: `${id}`,
                day: `${time}`,
                offset: 0,
                limit: 20,
                districtId: -1,
                lineId: -1,
                hallType: -1,
                brandId: -1,
                serviceId: -1,
                areaId: -1,
                stationId: -1,
                item: '',
                updateShowDay: false,
                reqId: `${reqId}`,
                cityId: 55
            }
        })
    }
}