(function(){
    var jquery_version = '3.5.1'
    var site_url = 'https://3eec2cde.ngrok.io'
    var static_url = site_url + 'static/'
    var min_width = 100;
    var min_height = 100;

    function bookmarklet(msg) {
        // загрузка css стилей
        var css = jQuery('<link>');
        css.attr({
            rel: 'stylesheet',
            type: 'text/css',
            href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.random()*999999999999999)
        });
        jQuery('head').append(css);
        // загрузка HTML
        box_html = '<div id="bookmarklet"><a href="#" id="close">&times;</a> \
                    <h1>Select an image to bookmark:</h1><div class="images"></div></div>';
        jQuery('body').append(box_html);

        // добавление скрытия букмарклета при нажатии на крестик
        jQuery('#bookmarklet #close').click(function(){jQuery('#bookmarklet').remove();});

        // находим картинки на текущем сайте и вставляем их в окном букмарклета
        jQuery.each(jQuery('img[src$="jpg"]'), function(index, image) {
            if (jQuery(image).width() >= min_width && jQuery(image).height() >= min_height) {
                image_url = jQuery(image).attr('src');
                jQuery('#bookmarklet .images').append('<a href="#"><img src="' + image_url + '"/></a>');
            }
        });

        // когда изображение выбрано, добавляем его в список сохраненных картинок на нашем сайте
        jQuery('#bookmarklet .images a').click(function(e){
            selected_image = jQuery(this).children('img').attr('src');
            // скрываем букмарклет
            jQuery('#bookmarklet').hide();
            // открываем новое окно с формой сохранения изображения
            window.open(site_url + 'images/create/?url=' + encodeURIComponent(selected_image) + '&title=' + encodeURIComponent(jQuery('title').text()), '_blank');
        });
    };
    // проверка, подключена ли jquery
    if(typeof window.jQuery != 'undefined') {
        bookmarklet();
    } else {
        // проверка что атрибут $ окна не  занят другим объектом
        var conflict = typeof window.$ != 'undefined';
        // создание тега скрипт с загрузкой jquery
        var script = document.createElement('script');
        script.src = '//ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + 'jquery.min.js';
        // добавление тега в блок хед документа
        document.head.appendChild(script);
        // добавление возможности использовать несколько попыток для загрузки jquery
        var attempts = 15;
        (function(){
            //проверка, подключена ли jquery
            if(typeof window.jQuery == 'undefined') {
                if(--attemtps > 0) {
                    // если не подключена, пытаемся снова загрузить
                    window.setTimeout(arguments.callee, 250);
                } else {
                    // превышено число попыток загрузки jquery, выводим сообщение
                    alert('An error occured hile loading jQuery')
                }
            } else {
                bookmarklet();
            }
        })();
    }
})();