
const _help = (obj, type)=>{
    console.log(obj, type)
}


$('#js-auth-form').submit((e)=>{
    e.preventDefault()
    let loginData = $('#js-auth-form').serialize();
    const _LOGIN_ROUTE = $('#js-auth-form').attr('action')
    const _LOGIN_METHOD = $('#js-auth-form').attr('method')
    const _REFERER_URL = $('#js-auth-form').data('referer') ? $('#js-auth-form').data('referer') : '/'
    $.ajax({
        url: _LOGIN_ROUTE,
        type: _LOGIN_METHOD,
        dataType: 'JSON',
        data: loginData,
        success: (res)=>{
            console.log(res)
            window.location.href = _REFERER_URL
        },
        error: (e)=>{
            errorHandle(e)
        }
    })
})

const errorHandle = (e)=>{
    console.log(e)
    $.toast({
        text : e.statusText,
        heading: 'Notice',
        position: 'top-right',
        icon: 'error',
        class: 'error'
    })
}


const initTheme = () =>{
    $(".metismenu").metisMenu()

    $(window).resize(function() {
        $(window).width() < 1300 ? $("body").addClass("enlarge-menu enlarge-menu-all") : $("body").removeClass("enlarge-menu enlarge-menu-all")
    })

    $(".button-menu-mobile").on("click", function(a) {
        a.preventDefault(),
        $("body").toggleClass("enlarge-menu")
    })

    $(".main-icon-menu .nav-link").on("click", function(a) {
        $("body").removeClass("enlarge-menu"),
        a.preventDefault(),
        $(this).addClass("active"),
        $(this).siblings().removeClass("active"),
        $(".main-menu-inner").addClass("active");
        var t = $(this).attr("href");
        $(t).addClass("active"),
        $(t).siblings().removeClass("active")
    })

    $(".leftbar-tab-menu a, .left-sidenav a").each(function() {
        var a = window.location.href.split(/[?#]/)[0];
        if (this.href == a) {
            $(this).addClass("active"),
            $(this).parent().addClass("active"),
            $(this).parent().parent().addClass("in"),
            $(this).parent().parent().addClass("mm-show"),
            $(this).parent().parent().parent().addClass("mm-active"),
            $(this).parent().parent().prev().addClass("active"),
            $(this).parent().parent().parent().addClass("active"),
            $(this).parent().parent().parent().parent().addClass("mm-show"),
            $(this).parent().parent().parent().parent().parent().addClass("mm-active");
            var t = $(this).closest(".main-icon-menu-pane").attr("id");
            $("a[href='#" + t + "']").addClass("active")
        }
    })

    feather.replace()

    $(".navigation-menu a").each(function() {
        var a = window.location.href.split(/[?#]/)[0];
        this.href == a && (n(this).parent().addClass("active"),
        $(this).parent().parent().parent().addClass("active"),
        $(this).parent().parent().parent().parent().parent().addClass("active"))
    })

    $(".navbar-toggle").on("click", function(a) {
        $(this).toggleClass("open"),
        $("#navigation").slideToggle(400)
    })

    $(".navigation-menu>li").slice(-2).addClass("last-elements")

    $('.navigation-menu li.has-submenu a[href="#"]').on("click", function(a) {
        $(window).width() < 992 && (a.preventDefault(),
        $(this).parent("li").toggleClass("open").find(".submenu:first").toggleClass("open"))
    })

    Waves.init()
}

var msg = " Scrolling Title ";
var pos = 0;
var spacer = " ... ";
var time_length = 100;

const ScrollTitle = () =>{
    document.title = msg.substring(pos, msg.length) + spacer + msg.substring(0, pos);
    pos++;
    if (pos > msg.length) pos=0;
    window.setTimeout("ScrollTitle()",100);
}


$(document).ready(function(){
    $(".quick-search > input").focus(function(){
        $(this).addClass('focus');
    });
    $(".quick-search > input").blur(function(){
        $(this).removeClass('focus');
    });

    // $('#js-quick-search').select2({
    //     ajax: {
    //       url: 'https://api.github.com/search/repositories',
    //       dataType: 'json'
    //       // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
    //     }
    // });
});

// ScrollTitle();

$(document).bind("contextmenu", function (e) {
    // e.preventDefault();
    // return false;
});


const _contextMenu = (obj, type, actionBtn = false) => {
    $('#context-menu').remove()
    const items = {
        task: [
            {icon: 'fa fa-eye', name: 'Detail', action: "detail"},
            {div: true},
            {icon: 'fa fa-copy', name: 'Copy link', action: "detail"},
            {icon: 'fa fa-copy', name: 'Copy ID', action: "detail"},
            {icon: 'fa fa-copy', name: 'Copy Subject', action: "detail"},
            {div: true},
            {icon: 'fa fa-arrow-right', name: 'Go to Feature', action: "detail"},
            {div: true},
            {icon: 'fa fa-times', name: 'Delete', action: "delete"}
        ],
        project: [
            {icon: 'fa fa-eye', name: 'Detail', action: "detail"},
            {div: true},
            {icon: 'fa fa-arrow-right', name: 'Go to Feature', action: "detail"},
            {div: true},
            {icon: 'fa fa-times', name: 'Delete', action: "delete"}
        ]
    }
    let top = $(obj.selector).offset().top;
    let left = $(obj.selector).offset().left;

    let w = $(obj.selector).width();
    let h = $(obj.selector).height();
    let ul = `<ul id="context-menu" style="top: ${obj.e.clientY}px; left: ${obj.e.clientX}px">
                    {ITEMS}
            </ul>`
    let li = [];
    items[type].forEach(item=>{
        if(item.div)
            li.push(`<hr>`)
        else
            li.push(`<li onclick="${item.action}"><i class="${item.icon}"></i> ${item.name}</li>`)
    })
    ul = ul.replace(/{ITEMS}/g, li.join(''))
    $('body').append(ul)
    if(actionBtn){
        $('#context-menu').css('left', (parseInt(obj.e.clientX) - 100)+'px')
    }
}


$(document).on('mousedown', '.row-action', function(e){
    let obj = $(e.target).closest('tr')
    // console.log(e)
    switch(e.which){
        case 1:
            if ($(e.target).hasClass('row-action-icon')){
                _contextMenu({selector: this, e}, 'project', true)
            }else{
                $('#context-menu').remove();
            }
            break;
        case 3:
            e.preventDefault()
            _contextMenu({selector: this, e}, 'project')
            return false;
            break;
        default:
            $('#context-menu').remove();
    }
})
