const moviesView = require('../views/movies.art');
const movieNowView = require('../views/movie-now.art')
const moviesListView = require('../views/movie-list.art')

const moviesComingView = require('../views/moviesComing.art')//即将上映的大框架（包括期待上映）
const movieComingView = require('../views/movie-coming.art')//要上映电影列表的框架
const moviesComingListView = require('../views/moviesComingList.art')//装填要上映的每个电影
const moviesComingExpectListView = require('../views/moviesExpectList.art')

const moviesModel = require('../models/movies')
const moviesComingModel = require('../models/moviesComing')
const moviesExpectModel = require('../models/moviesExpect')
const _ = require('lodash')

class Movies{
    constructor(){
        this.list = []//热映电影列表
        this.moviesComingList = []
        this.moviesExpectList = []
        this.movieIdList = []
        this.movieComingIdList = []
        this.moviePage = 0
        this.movieComingPage = 1
        this.hell = []
        this.expectTotal 
        this.exmpectOffset = 10
    }

    //渲染即将上映部分大框架
    async moviesComingRender(){
        let result = await moviesComingModel.get({id:'comingList?ci=1&token=&limit=10'})
        this.moviesComingList = result.coming
        this.movieComingIdList = _.chunk(result.movieIds,10)
        
        let re = /w.h\//
        for(let attr in this.moviesComingList){
            this.moviesComingList[attr].img = this.moviesComingList[attr].img.replace(re,'128.180/')
        }
        this.hell = _.groupBy(this.moviesComingList,'comingTitle')
        

        let movieComingHtml = movieComingView({})
        $('.list-wrap').html(movieComingHtml)

        let that = this
        await this.moviesComingRenderer()//this.moviesComingList


        let bScroll = new BScroll($('.item-content-coming').get(0),{
            probeType:2,
            click:true
        })
        bScroll.on('scrollEnd',async function(){
            //下拉刷新
            if(this.y >=0){
                
            }
            //上拉加载
            if(this.maxScrollY >= this.y && that.movieComingPage < that.movieComingIdList.length){
                let str='moreComingList?ci=1&token=&limit=10&movieIds='
                for(var i = 0; i < that.movieComingIdList[that.movieComingPage].length; i++){
                    if(i != 0){
                        str += '%2C'
                    }
                    str += that.movieComingIdList[that.movieComingPage][i]
                }
              
                that.movieComingPage++;
                let result = await moviesComingModel.get({id:str})
               
                
                that.moviesComingList = [...that.moviesComingList,...result.coming]
                
                let re = /w.h\//
                for(let attr in that.moviesComingList){
                    that.moviesComingList[attr].img = that.moviesComingList[attr].img.replace(re,'128.180/')
                }
                
                that.hell = _.groupBy(that.moviesComingList,'comingTitle')
                
                
                that.moviesComingListRender()
                
            }
            this.refresh()
        })
        bScroll.on('scroll',function(){
            //上拉一部分后下载部分消失
            if(this.y <= -100){
                $('.download-header').css('display','none');
            }
            else if(this.y >= -100){
                $('.download-header').css('display','flex');
            }
        })

    }
    //装填即将上映部分大框架
    async moviesComingRenderer(){//list
        let moviesComingHtml = moviesComingView({})//list
        $('.item-content-coming>div').html(moviesComingHtml)

        await this.moviesComingExpectRender()
        await this.moviesComingListRender()
    }

    //渲染期待上映部分
    async moviesComingExpectRender(){
        let that = this
        let result = await moviesExpectModel.get({})
        this.moviesExpectList = result.coming
        this.expectTotal = result.paging.total
        let re = /w.h\//
        for(let attr in this.moviesExpectList){
            this.moviesExpectList[attr].img = this.moviesExpectList[attr].img.replace(re,'170.230/')
        }

        let moviesComingExpectHtml = moviesComingExpectListView({
            list:this.moviesExpectList
        })
        $('.most-expected-list>div>div').html(moviesComingExpectHtml)
       
        let bScrollExp = new BScroll($('.most-expected-list>div').get(0),{
            scrollY:false,
            scrollX:true,
            probeType:2,
            click:true,
        })
       
        bScrollExp.on('scrollEnd',async function(){

            if(this.maxScrollX>=this.x && that.expectTotal-10>=that.exmpectOffset){
                
                let result = await moviesExpectModel.get({offset:that.exmpectOffset})
                
                let re = /w.h\//
                for(let attr in result.coming){
                    result.coming[attr].img = result.coming[attr].img.replace(re,'170.230/')
                }
                that.moviesExpectList = [...that.moviesExpectList,...result.coming] 
                let moviesComingExpectHtml = moviesComingExpectListView({
                    list:that.moviesExpectList
                })
                $('.most-expected-list>div>div').html(moviesComingExpectHtml)
                that.exmpectOffset += 10
            }
            this.refresh()
        })
        
    }
    //渲染将要上映部分的电影们
    async moviesComingListRender(){
       
        let moviesComingListHtml = moviesComingListView({
            list:this.hell
        })
        $('.coming-list').html(moviesComingListHtml)
        
    }

    //渲染正在热映部分
    async moviesNowRender(){
        //将item-content装填进去
        let movieNowHtml = movieNowView({})
        $('.list-wrap').html(movieNowHtml)

       
        let that = this
        let result = await moviesModel.get({id:'/movieOnInfoList?token='})
       
        this.movieIdList = result.movieIds
        //this.list = result = result.movieList
        
        this.list = result.data.list.list

       /*  let re = /w.h\//
        for(let attr in result){
            result[attr].img=result[attr].img.replace(re,'128.180/')
            if(result[attr].globalReleased){
                result[attr].globalReleased = '购票'
                result[attr].btnbg = 'red'
            }
            else{
                result[attr].globalReleased = '预告'
                result[attr].btnbg = 'blue'
            }
        } */
        console.log(this.list);
        
        this.moviesNowRenderer(this.list)
        let bScroll =new BScroll($('.item-content').get(0),{
            probeType:2,
            click:true,
        })
       
        bScroll.on('scrollEnd',async function(){
            //下拉刷新
            if(this.y >= 0){
                let result = await moviesModel.get({id:'/moreComingList?token=&movieIds=1258394'})
                result = result.coming
                let re = /w.h\//
                for(let attr in result){
                    result[attr].img=result[attr].img.replace(re,'128.180/')
                    if(result[attr].globalReleased){
                        result[attr].globalReleased = '购票'
                        result[attr].btnbg = 'red'
                    }
                    else{
                        result[attr].globalReleased = '预告'
                        result[attr].btnbg = 'blue'
                    }
                }

                that.list = [...result,...that.list]
                that.moviesNowRenderer(that.list)
            }
            
            //上拉加载更多
            if(this.maxScrollY >= this.y&&Math.ceil((that.movieIdList.length-12)/5) >= that.moviePage){
                
                let str = '/moreComingList?token=&movieIds='
                for(let i = that.moviePage*5+12; i < that.moviePage*5+12+5&&i<that.movieIdList.length; i++){
                    if(i != that.moviePage*5+12){
                        str += '%2C'
                    }
                    str += that.movieIdList[i];
                }
                that.moviePage++
                let result = await moviesModel.get({id:str})

                result = result.coming
                let re = /w.h\//
                for(let attr in result){
                    result[attr].img=result[attr].img.replace(re,'128.180/')
                    if(result[attr].globalReleased){
                        result[attr].globalReleased = '购票'
                        result[attr].btnbg = 'red'
                    }
                    else{
                        result[attr].globalReleased = '预告'
                        result[attr].btnbg = 'blue'
                    }
                }

                that.list = [...that.list,...result]
                that.moviesNowRenderer(that.list)
            }

            this.refresh()
        })
        bScroll.on('scroll',function(){
            //上拉一部分后下载部分消失
            if(this.y <= -100){
                $('.download-header').css('display','none');
            }
            else if(this.y >= -100){
                $('.download-header').css('display','flex');
            }
        })
      
      
    }

    moviesNowRenderer(list){
        let moviesListHtml = moviesListView({
            list
        })
       
        $('.item-content>div').html(moviesListHtml)
        
        $('.item').on('click',function(){
            let id = $(this).attr('data-id')
            location.hash = `details?movieId=${id}`
        })
    }

    //电影页面渲染
    async render(){
        let that = this
        //先将moviehtml装填到main中
        let $main = $('main');
        let moviesHtml = moviesView({})
        $main.html(moviesHtml)

      
        //然后把movielist装填到moviehtml中
        this.moviesNowRender(this.list)

        //点击切换正在热映和即将上映
        $('.switch-hot>div').on('click',function(){
            $(this).addClass('hot-item-active').siblings().removeClass('hot-item-active')
            if($(this).attr('data-to') == 'moviesNow'){
                that.moviesNowRender(that.list)
            }
            else if($(this).attr('data-to') == 'moviesComing'){
                that.moviesComingRender(that.moviesComingList)
            }
        })

        //点击搜索跳转
        $('.search-entry').on('click',function(){
            location.hash = 'search'
        })
       
        $('.city-entry').on('click',function(){
            $('#city-list').css('display','block')
        })
        $('.city-item').on('click',function(){
            
            $('#city-list').css('display','none')
            $('.city-entry span').html($(this).html())
        })

        //点击logo 跳转到与后台通讯页面
        $('.logo-img').on('click',function(){
            location.hash = 'message'
        })
       
    }
}

export default new Movies();

