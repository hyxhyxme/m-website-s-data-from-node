//引入layout  框架
import indexController from '../controllers/index'

import moviesController from '../controllers/movies'
import cinemasController from '../controllers/cinemas'
import accountController from '../controllers/account'
import detailsController from '../controllers/details'
import searchController from '../controllers/search'
import cinemaDetailsController from '../controllers/cinema-details'
import messageController from '../controllers/message'

class Router{
    constructor(){
        this.render()
    }
    render(){
        window.addEventListener('hashchange',this.handleHashChange.bind(this))
        window.addEventListener('load',this.handlePageload.bind(this))
    }
    handleHashChange(){
        let hash = location.hash.substr(1)

        let re = /([^?]+)\?([^?]+)/
        let path = re.exec(hash)
        if(path){
            this.renderDom(path[1])
            this.renderDom(path[1])
            this.setActiveClass(path[1])
        }
        else{
            this.renderDom(hash)
            this.renderDom(hash)
            this.setActiveClass(hash)
        }
        
        
    }
    handlePageload(){
        let hash = location.hash.substr(1) || 'movies'
        indexController.render()
        
        let re = /([^?]+)\?([^?]+)/
        let path = re.exec(hash)
        
        if(path){
            
            location.hash = path[1]

            this.renderDom(path[1])
            this.setActiveClass(path[1])
        }
        else{
            location.hash = hash

            this.renderDom(hash)
            this.setActiveClass(hash)
        }
        
    }
    setActiveClass(hash){
        $(`footer div[data-to="${hash}"]`).addClass('active').siblings().removeClass()
       
    }
    renderDom(hash){
       
        let PageControllers = {
            moviesController,
            cinemasController,
            accountController,
            detailsController,
            searchController,
            cinemaDetailsController,
            messageController
        }
        indexController.render()
        PageControllers[hash+'Controller'].render()
    }

}

new Router()