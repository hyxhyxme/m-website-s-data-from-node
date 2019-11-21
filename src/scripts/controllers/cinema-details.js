const cinemaDetailsView = require('../views/cinema-details.art')
const cinemalDetailsModel = require('../models/cinemal-details')

class CinemaDetails{
    constructor(){
        this.id
        this.time = []
        this.showData = {}
        this.cinemaData = {}
        
    }
    async render(){
        let that = this
        //获取影院的id        
        let hash = location.hash.substr(1)
        let re = /([^?]+)\?([^?]+)/
        let path = re.exec(hash)
        if(path){
            re = /([^?]+)\=([^?]+)/
            this.id = re.exec(path[2])[2]
        }
        
        //获取十五天日期的数组
        this.time = this.getTimes()

        let result = await cinemalDetailsModel.get({cinemaId:this.id})
        this.cinemaData = result.cinemaData
        this.showData = result.showData
        if(this.showData){
            let re = /w.h\//
            for(var i = 0; i < this.showData.movies.length; i++){
                this.showData.movies[i].img = this.showData.movies[i].img.replace(re,'148.208/')
            }
        }
        
        //装填页面
        let html = cinemaDetailsView({
            time : this.time,
            cinemaData : this.cinemaData,
            showData : this.showData
        })
        $('#root').html(html)

        //并选中第一个日期
        $('#timeline>li:first-child').addClass('chosen')
        //点击查看不同日期的售票情况
        $('.showDay').on('click',async function(){
            $(this).addClass('chosen').siblings().removeClass('chosen')
             
        })
        $('.post-bg').css('background-image',`url(${that.showData.movies[0].img})`)

        let bScroll = new BScroll($('.details-container').get(0),{
            probeType:2,
            click:true
        })
        let bScrollCol = new BScroll($('#showDays').get(0),{
            probeType:2,
            click:true,
            scrollX:true,
            scrollY:false
        })
        $(document).ready(function(){
            let swiper = new Swiper('.swiper-container', {
                loop: false,
                slidesPerView: 3,
                spaceBetween: 30,
                centeredSlides: true,
            });
            $('.swiper-container').on('touchend',function(){
                $('.movie-info .title').html(that.showData.movies[$('.swiper-slide-active').index()].nm)
                $('.post-bg').css('background-image',`url(${that.showData.movies[$(".swiper-slide-active").index()].img})`)
            })
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
}
module.exports = new CinemaDetails()