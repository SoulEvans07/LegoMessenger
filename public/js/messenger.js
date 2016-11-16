function fetch(url) {
    if($('#user').text() == "") {
        console.log("empty username");
        return;
    }

    var fetchData = {
        user: $('#user').text(),
        last: Date.now()
    };

    console.log("fetch: " + url + "/chat");
    $.ajax({
        timeout: 2000,
        async: true,
        type: 'POST',
        url: "/chat",
        data: JSON.stringify(fetchData),
        contentType: 'application/json',
        success:
            function (data) {
                var ret = jQuery.parseJSON(data);
                if (ret.length > 0) {

                    ret.forEach(function (m) {
                        if (m.msg !== undefined){
                            var side = 'left';
                            var iside = 'right';
                            // var color = '#9b423d';
                            var color = intToHex(hashCode(m.user.email.toString()));
                            var color_bck = faint(color);

    // * TODO: move this check to server side and put it in te message object .Soul
                            if(m.user.username.toString() == $('#user').text()) {
                                side = 'right';
                                iside = 'left';
                                // color = '#45829b';
                            }

                            $('.messages').append(
                                '<li class="message ' + side + ' appeared">' +
                                '<div class="avatar">' +
                                '<i style="color:' + color + '; font-size:60px" class="fa fa-circle" aria-hidden="true"></i>' +
                                '</div>' +
                                '<div style="background-color:'+ color_bck +';" class="text_wrapper ' + m.user.username + '">' +
                                '<div style="color:' + color + ';" class="text">' + m.user.username + ' : ' + m.msg + '</div>' +
                                '</div>' +
                                '</li>'
                            );
                        }
                    });

    // * TODO: Scroll down .Soul
                    // var first = $('.messages li' ).first();
                    // var height = 0;
                    // $('.messages').each(function (li) {
                    //     height += li.height();
                    // });
                    // console.log("h " +height);
                    // var last = $('.messages li').last();
                    // var h = last.outerHeight();
                    // $('.messages').animate({
                    //     scrollTop: height//last.position().top + h
                    // }, 'slow');
                    $('.messages').animate({
                        scrollTop: 999999//last.position().top + h
                    }, 'slow');
                }
            }
    });
}

function sendMessage(url) {
    if($('.message_input').val() == "") {
        console.log("empty msg");
        return;
    }

    if($('#user').text() == "") {
        console.log("empty username");
        return;
    }

    var msg_data = {
        message: {
            user: $('#').val(),
            msg: $('.message_input').val(),
            timestamp: Date.now()
        }
    };

    $.ajax({
        timeout: 2000,
        async: true,
        type: 'POST',
        url: "/chat",
        data: JSON.stringify(msg_data),
        contentType: 'application/json',
        success: function () {
            $('.message_input').val('');
        },
        error: function(req, txt, err) {
            console.log("Error: " + txt);
            console.log("Error: " + err);
        }
    });
}

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToHex(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c;
}

function faint(color) {
    var FAINT_CONST = 60;
    var rgb = [
        color.substring(1, 3),
        color.substring(3, 5),
        color.substring(5, 7)
    ];
    var frgb = "#";

    rgb.forEach(function (c) {
        var faint = parseInt(c, 16);
        faint += FAINT_CONST;
        if(faint <= 255)
            frgb += faint.toString(16);
        else
            frgb += "FF";
    });

    return frgb;
}