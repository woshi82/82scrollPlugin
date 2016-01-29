/*if(data.length<pageSize){
        rechargeListLoad.hintLoadHide();
    }else{  
        rechargeListLoad.goOnLoad();
    }      
    rechargeListLoad.loadOK();|| rechargeListLoad.refreshOK();  
*/



function YLLoad(json){ 
    this.content = $('#'+json.content);
    this.drag = this.content.parents('.YL_list');
    this.initDOM();
    this.sPosX = 0;
    this.sPosY = 0;
    this.posXL = 0;
    this.posYL = 0;
    this.refresh = json.refresh||null;
    this.load = json.load||null;
    this.bLoad = true;
    this.iNow = 0;
    this.iPre = 0;
    this.static = true;
}
YLLoad.prototype.initDOM = function(){
    this.drag.prepend('<div class="refresh" id="refresh"> <div class="keep_drag"> <span class="keep_point"></span> 保持下拉. </div> <div class="release_drag"> <span class="keep_point release_point"></span> 放松刷新. </div> <div class="loading_drag"> <span class="loading_point"></span> 拼命加载中... </div> <div class="ok_drag"> <span class="ok_point"></span> 刷新成功 ! </div> </div>') ;
    this.drag.append('<div class="loading_wrap" id="loading_wrap"> <span class="loading"></span> 拼命加载中... </div>');
    this.hint = $('.YL_list').find('#refresh');
    this.hintLoad = $('.YL_list').find('#loading_wrap');
    this.hintdiv = this.hint.find('div');
};
YLLoad.prototype.init = function(){
    var This = this;
    this.drag.on('touchstart',function(ev){
        This.dragStart(ev.originalEvent);
            // This.dragStart(ev);
        });
    this.drag.on('touchmove',function(ev){
        This.dragMove(ev.originalEvent);
    });
    this.drag.on('touchend',function(ev){
        This.dragEnd(ev.originalEvent);
    });
    this.drag.on('touchcancle',function(ev){
        This.dragEnd(ev.originalEvent);
    });
    $(window).on('scroll',function(ev){
        This.scrollEnd(ev.originalEvent);
    });
}

YLLoad.prototype.scrollEnd = function(ev){
    if($(window).scrollTop() >=(this.hintLoad.offset().top-$(window).height()) && this.bLoad&&this.hintLoad.is(':visible')){
        if(typeof this.load === 'function'){
            this.bLoad = false;
            this.load();
        }
    }
}
YLLoad.prototype.dragStart = function(ev){
    this.content.removeClass('transition');
        // console.log(ev.originalEvent.touches[0])
        this.sPosX = ev.touches[0].pageX;
        this.sPosY = ev.touches[0].pageY;

}
YLLoad.prototype.dragMove = function(ev){

    
    this.posXL = ev.touches[0].pageX-this.sPosX;
    this.posYL = ev.touches[0].pageY-this.sPosY;
    if(Math.abs(this.posYL)>Math.abs(this.posXL)&&this.posYL>0){
        this.upPos();
        this.showFir();
        if(this.posYL>48*3&&this.static){
            this.static = false;
            this.showRelease();
        }
    }
    if($(window).scrollTop()===0&&this.posYL>0)ev.preventDefault();
    this.upLoad=false;
    (this.posYL<0) && (this.upLoad=true);
   
    
}
YLLoad.prototype.dragEnd = function(ev){
    this.content.addClass('transition');
    if(Math.abs(this.posYL)>Math.abs(this.posXL)&&this.posYL>46*3){
        this.posYL = 38*3;
        this.posXL = 38*3;
        this.upPos();
        this.showLoad();
        if(typeof this.refresh === 'function'){
            this.refresh();
        }
    }else{
        this.posYL = 1*3;
        this.posXL = 1*3;
        this.upPos();
        this.goInit();
    }
    this.posYL = 0;
    this.posXL = 0;
    this.static = true;
}
YLLoad.prototype.goOnLoad = function(){    
    (this.hintLoad.offset().top < $(window).height())&&this.load()
}
YLLoad.prototype.loadOK = function(){    
    this.hintLoad.show();
    this.bLoad = true;
}
YLLoad.prototype.hintLoadHide = function(){
        this.hintLoad.hide();
}

YLLoad.prototype.goInit = function(){
    this.hintdiv.css({
        'opacity': 0
    });
    this.hint.css({
        'opacity': 0,
        'transform': 'scale(0,0)',
        '-webkit-transform': 'scale(0,0)'
    });
    this.hintdiv.eq(0).css({
        'opacity': 1
    });
}
YLLoad.prototype.upPos = function(){
    this.content.css({
        'transform': 'translate3d(0,'+this.posYL/3+'px,0)',
        '-webkit-transform': 'translate3d(0,'+this.posYL/3+'px,0)'
    });
}
YLLoad.prototype.showFir = function(){
    var x = y = Math.min(this.posYL/(40*3),1);
    this.hint.css({
        'opacity': x,
        'transform': 'scale('+x+','+y+')',
        '-webkit-transform': 'scale('+x+','+y+')'
    });
}
YLLoad.prototype.showRelease = function(){
    this.hintdiv.eq(0).css({
        'opacity': 0
    });
    this.hintdiv.eq(1).css({
        'opacity': 1
    });
}
YLLoad.prototype.showLoad = function(){
    this.hintdiv.eq(1).css({
        'opacity': 0
    });
    this.hintdiv.eq(2).css({
        'opacity': 1
    });
}
YLLoad.prototype.showOk = function(){
    this.hintdiv.eq(2).css({
        'opacity': 0
    });
    this.hintdiv.eq(3).css({
        'opacity': 1
    });
    // this.loaded();
}
YLLoad.prototype.refreshOK = function(){
    var This =this;
    This.showOk();
    setTimeout(function(){
        This.goInit();
        This.upPos();
        This.loadOK();
    },300)
}