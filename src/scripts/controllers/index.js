const layoutView = require('../views/layout.art')

class Index{

    bindClick(){
        location.hash = $(this).attr('data-to')
    }

    render(){
        const html = layoutView({})
        $('#root').html(html);

        $('footer .tabbar div').on('click',this.bindClick)
    }
}

export default new Index();