const searchView = require('../views/search.art')
const searchListView = require('../views/search-list.art')
const searchListModel = require('../models/search')

class Search{
  
    render(){
        let searchHtml = searchView({})
        $('#root').html(searchHtml)

        $('.search-input').on('input',async function(){
            if($(this).val()){
                $('.search-history').css('display','none')
                $('.search-result').css('display','block')
                
                let result = await searchListModel.get({kw:$(this).val()})
                
                
                if(result){
                    let re = /w.h\//
                   
                    for(var i = 0; i < result.movies.list.length; i++){
                        result.movies.list[i].img = result.movies.list[i].img.replace(re,'128.180/')
                    }
                    result.movies.list.length = 3;
                    let html = searchListView({
                        list:result.movies.list
                    })
                    $('.result-wrapper').html(html)
                }
            }
            else{
                $('.search-history').css('display','block')
                $('.search-result').css('display','none')
            }
        })
        let bScroll = new BScroll($('.search-container').get(0),{
            prototype:2,
            click:true,
        })
        
    }


}
export default new Search()