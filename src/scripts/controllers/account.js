import accountView from '../views/account.art'
import indexController from '../controllers/index'
class Account{
    render(){
        let html = accountView({})
        let $main = $('#root')
        $main.html(html)
        
        $('li').on('click',function(){
            if($('.nav ul').attr('data-com')=='isleft'){
                $('.nav ul').attr('data-com','isright')
                $('.nav ul').removeClass('isleft').addClass('isright')
                $('#normal-login-form').css('display','none')
                $('#quick-login-form').css('display','block')

            }
            else if($('.nav ul').attr('data-com')=='isright'){
                $('.nav ul').attr('data-com','isleft')
                $('.nav ul').removeClass('isright').addClass('isleft')
                $('#normal-login-form').css('display','block')
                $('#quick-login-form').css('display','none')
            }
           
        })
    }
}

export default new Account()