const searchListView = require('../views/search-list.art')
const searchListModel = require('../models/search')

class SearchList{
    
    async render(){

        let result = await searchListModel.get({})
        
        let html = searchListView({})

        $('.result-wrapper').html(html)
    }
}
export default new SearchList()