const detailsView = require('../views/details.art')
import cinemaListView from '../views/cinema-list.art'
import detailsModel from '../models/details'
import detailsCinemasModel from '../models/details-cinemas'
class Details{
    constructor(){
        this.id
        this.time = []
    }
    async render(){  

        //获取电影的id        
        let hash = location.hash.substr(1)
        let re = /([^?]+)\?([^?]+)/
        let path = re.exec(hash)
        if(path){
            re = /([^?]+)\=([^?]+)/
            this.id = re.exec(path[2])[2]
        }

        //获取十五天日期的数组
        this.time = this.getTimes()

        //根据id获取电影的具体信息
        let resultDetails = await detailsModel.get({id:this.id})
        //对获取到的数据进行格式修改
        re = /w.h\//
        resultDetails.detailMovie.img = resultDetails.detailMovie.img.replace(re,'148.208/')
        //装填电影内容的框架
        let html = detailsView({
            details:resultDetails.detailMovie,
            time:this.time
        })
        $('#root').html(html)
        //并选中第一个日期
        $('#timeline>li:first-child').addClass('chosen')

        
        //装填上演这个电影的影院
        let day = this.getday(this.time[0])
        let r = await detailsCinemasModel.get({
            id:this.id,
            time:day,
            reqId:new Date().getTime()
        })
        let cinemaListHtml = cinemaListView({
            list:r.cinemas,
        })
        $('.list-content div').html(cinemaListHtml)

        let bScroll = new BScroll($('.details-container').get(0),{
            probeType:2,
            click:true
        })

        let bScrollCross = new BScroll($('#showDays').get(0),{
            probetType:2,
            click:true,
            scrollX:true,
            scrollY:false
        })
        let that = this
        //点击查看不同日期的影院
        $('.showDay').on('click',async function(){
            $(this).addClass('chosen').siblings().removeClass('chosen')
            let day = that.getday(that.time[$(this).index()])
            let r = await detailsCinemasModel.get({
                id:that.id,
                time:day,
                reqId:new Date().getTime()
            })
            let cinemaListHtml = cinemaListView({
                list:r.cinemas,
            })
            $('.list-content div').html(cinemaListHtml)

            
        })

    }
    getTimes(){
        let month = new Date().getMonth()+1
        let day  = new Date().getDate()
        let time = []
        for(var i = 0; i < 15; i++){
            time.push({month,day})
            if([1,3,5,7,8,10,12].indexOf(month)!=-1){
                if(day == 31){
                    day = 1;
                    month++;
                    if(month==13)
                        month=1
                }
                else{
                    day++
                }
            }
            else if(month==2){
                if(day == 28){
                    day = 1;
                    month++;
                }
                else{
                    day++
                }
            }
            else{
                if(day == 30){
                    day = 1;
                    month++;
                }
                else{
                    day++
                }
            }
        }
        return time
    }
    getday(obj){
        let day = '2019-'
        day +=  obj.month
        day += '-'
        day += obj.day
        return day
    }
   
}
export default new Details()