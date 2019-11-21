import cinemasView from '../views/cinemas.art'
import cinemaListView from '../views/cinema-list.art'
import cinemasModel from '../models/cinemas'
class Cinema{
    constructor(){
        this.list = [],
        this.offset = 20,
        this.total
    }
    async render(){
        let that = this
        let result = await cinemasModel.get({})
        this.total = result.paging.total
        this.list = result = result.cinemas
        //将cinemas装填到main中
        let cinemasHtml = cinemasView({})
        let $main = $('main')
        $main.html(cinemasHtml)

        //将list们装填到cinemas-list中
        await this.renderer(this.list)

        
        let bScroll = new BScroll($('.list-content').get(0),{
            probeType:2,
            click:true,
        })

        bScroll.on('scrollEnd',async function(){
            //上拉加载
            if(this.maxScrollY >= this.y && that.offset <= that.total-5){
                let result = await cinemasModel.get({
                    offset:that.offset,
                    limit:5
                })
                that.offset += 5;
                result = result.cinemas
                that.list = [...that.list,...result]
                that.renderer(that.list)
            }
            this.refresh()
        })

        $('.items').on('click',function(){
            let id = $(this).attr('data-id')
            location.hash = `cinemaDetails?cinemaId=${id}`
        })
        
    }

     //将list们装填到cinemas-list中
    renderer(list){
        let cinemaListHtml = cinemaListView({
            list
        })
        $('main .list-content div').html(cinemaListHtml)
    }
}

export default new Cinema()