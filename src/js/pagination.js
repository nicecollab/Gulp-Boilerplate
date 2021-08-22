(function ($) {
    $.fn.ktpagination = function (config) {

        let params = {}
        let query = window.location.search.substring(1);
        let vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }



        let defaultConfig = {
            data: {
                "current_page": 1,
                "from": 1,
                "last_page": 1,
                "per_page": "1",
                "to": 1,
                "total": 1
            },
            step: 10,
            show: 5,
            beforeRedirect: false,
            onClickHandler: "redirect",
            nextLabel: "Next",
            prevLabel: "Prev",
            urlPath: window.location.origin + window.location.pathname
        }

        let c = {...defaultConfig, ...config}

        function redirect(page){
            params.page = page;
            let _url = [];
            Object.keys(params).forEach((key)=>{
                _url.push(key + "=" + params[key])
            })
            window.location.href = c.urlPath + "?"+_url.join("&")
        }


        if(c.data.last_page > 1){


            let rootEl = this
            let first = {},
                prev10 = {},
                prev = {},
                next = {},
                next10 = {},
                last = {},
                displayFrom = false,
                displayTo = false,
                dotBefore = false,
                dotAfter = false,
                pagiContent = [];

            let itemHtml = `<li class="page-item kt-pagi-item {ITEM_CSS}"><a class="page-link" data-page="{NUMBER}">{NUMBER}</a></li>`
            let dotHtml = `<li class="page-item disabled"><a class="page-link">...</a></li>`
            let wrapperHtml = `<nav aria-label="Page navigation example">
                <ul class="pagination">
                <li class="page-item {FIRST_CSS}">
                    <a class="kt-pagi-first page-link" data-page="1" href="#" aria-label="Previous">
                        <i class="fa fa-angle-double-left" data-page="1"></i>
                    </a>
                </li>
                <li class="page-item {PREV10_CSS}">
                    <a class="kt-pagi-prev10 page-link" data-page="{PREV10_NUMBER}" href="#" aria-label="Previous">
                        <i class="fa fa-angle-left" data-page="{PREV10_NUMBER}"></i>
                    </a>
                </li>
                <li class="page-item {PREV_CSS}">
                    <a class="kt-pagi-prev page-link" data-page="{PREV_NUMBER}" href="#" aria-label="Previous">
                        {PREV_TEXT}
                    </a>
                </li>

                {PAGICONTENT}

                <li class="page-item {NEXT_CSS}">
                    <a class="kt-pagi-next page-link" data-page="{NEXT_NUMBER}" href="#" aria-label="Previous">
                        {NEXT_TEXT}
                    </a>
                </li>
                <li class="page-item {NEXT10_CSS}">
                    <a class="kt-pagi-next10 page-link" data-page="{NEXT10_NUMBER}" href="#" aria-label="Next">
                        <i class="fa fa-angle-right" data-page="{NEXT10_NUMBER}"></i>
                    </a>
                </li>
                <li class="page-item {LAST_CSS}">
                    <a class="kt-pagi-last page-link" data-page="{LAST_NUMBER}" href="#" aria-label="Next">
                        <i class="fa fa-angle-double-right" data-page="{LAST_NUMBER}"></i>
                    </a>
                </li>
                </ul>
            </nav>`

            //Fist
            if(c.data.current_page == 1) first.css = "disabled"
            //Prev10
            if(c.data.current_page == 1) prev10.css = "disabled"
            //prev
            if(c.data.current_page == 1) prev.css = "disabled"
            //next
            if(c.data.current_page == c.data.last_page) next.css = "disabled"
            //next10
            if(c.data.current_page == c.data.last_page) next10.css = "disabled"
            //last
            if(c.data.current_page == c.data.last_page) last.css = "disabled"

            if(c.data.current_page > 1) prev.num = parseInt(c.data.current_page) - 1
            if(c.data.current_page < c.data.last_page) next.num = parseInt(c.data.current_page) + 1
            if(parseInt(c.data.current_page) + parseInt(c.step) > c.data.last_page){
                next10.num = c.data.last_page
            }else{
                next10.num = parseInt(c.data.current_page) + parseInt(c.step)
            }

            if(parseInt(c.data.current_page) - parseInt(c.step) < 1){
                prev10.num = 1
            }else{
                prev10.num = parseInt(c.data.current_page) - parseInt(c.step)
            }

            last.num = c.data.last_page;

            if(c.data.last_page > c.show){
                if(c.data.current_page > c.show) {
                    dotBefore = true;
                    if(c.data.current_page > (parseInt(c.data.last_page) - parseInt(c.show))){
                        dotAfter = false;
                    }else{
                        dotAfter = true;
                    }
                }else{
                    dotAfter = true;
                }
            }

            if(c.data.current_page <= c.show && c.show <= c.data.last_page){
                displayFrom = 1;
                displayTo = c.show;
            }
            if(c.data.current_page <= c.show && c.show > c.data.last_page){
                displayFrom = 1;
                displayTo = c.data.last_page;
            }
            if(c.data.current_page > c.show && c.show <= c.data.last_page){
                displayFrom = parseInt(c.data.current_page) - (Math.round(parseInt(c.show)/2))
                displayTo = parseInt(c.data.current_page) + (Math.round(parseInt(c.show)/2))
            }


            if(dotBefore){
                pagiContent.push(dotHtml)
            }

            for(let i = displayFrom; i<= displayTo; i++ ){
                let html = itemHtml.replace(/{NUMBER}/g, i)
                html = html.replace(/{ITEM_CSS}/g, i == c.data.current_page ? 'active' : '')
                pagiContent.push(html)
            }

            if(dotAfter){
                pagiContent.push(dotHtml)
            }

            wrapperHtml = wrapperHtml.replace(/{FIRST_CSS}/g, first.css)
            wrapperHtml = wrapperHtml.replace(/{PREV10_CSS}/g, prev10.css)
            wrapperHtml = wrapperHtml.replace(/{PREV_CSS}/g, prev.css)
            wrapperHtml = wrapperHtml.replace(/{NEXT_CSS}/g, next.css)
            wrapperHtml = wrapperHtml.replace(/{NEXT10_CSS}/g, next10.css)
            wrapperHtml = wrapperHtml.replace(/{LAST_CSS}/g, last.css)

            wrapperHtml = wrapperHtml.replace(/{NEXT10_NUMBER}/g, next10.num)
            wrapperHtml = wrapperHtml.replace(/{PREV10_NUMBER}/g, prev10.num)
            wrapperHtml = wrapperHtml.replace(/{PREV_NUMBER}/g, prev.num)
            wrapperHtml = wrapperHtml.replace(/{NEXT_NUMBER}/g, next.num)

            wrapperHtml = wrapperHtml.replace(/{LAST_NUMBER}/g, last.num)
            wrapperHtml = wrapperHtml.replace(/{PREV_TEXT}/g, c.prevLabel)
            wrapperHtml = wrapperHtml.replace(/{NEXT_TEXT}/g, c.nextLabel)
            wrapperHtml = wrapperHtml.replace(/{PAGICONTENT}/g, pagiContent.join(''))

            rootEl.html(wrapperHtml)


            rootEl.on('click', '.kt-pagi-item', function(e){
                //console.log("ITEM", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-first', function(e){
                //console.log("FIRST", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-prev10', function(e){
                //console.log("PREV10", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-prev', function(e){
                //console.log("PREV", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-next', function(e){
                //console.log("NEXT", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-next10', function(e){
                //console.log("NEXT10", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
            rootEl.on('click', '.kt-pagi-last', function(e){
                //console.log("LAST", $(e.target).data('page'))
                eval(c.onClickHandler)($(e.target).data('page'))
            })
        }

    };
})(jQuery);
