import messageView from '../views/message.art'
import messageListView from '../views/messagelist.art'

class Message{
    constructor(){
        this.messagelist = []
    }
    render(){
        let html = messageView()
        let $main = $('#root')
        $main.html(html)


        let that = this

        var socket = io.connect('localhost:80')
    
     
        $('.btn-send').on('click',function(){
         
            var content = $('.send-content').val()
            if(content){
                that.messagelist.push({'maoyan' : content})
                socket.emit('maoyan',content)
                that.renderer()
                $('.send-content').val('')
            }
        })

        socket.on('server',function(msg){
            that.messagelist.push({'houtai': msg})
            that.renderer()
        })

    }
    renderer(){
        let messageListHtml = messageListView({
            messagelist : this.messagelist
        })
        let $ul = $('.message-list')
        $ul.html(messageListHtml)
    }
}

export default new Message()