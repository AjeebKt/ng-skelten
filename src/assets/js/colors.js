function colorsIn(color) {
    document.documentElement.style.setProperty('--theme-color', color);

    function hexToRGB(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
    hexToRGB(color, 0.5)

    function shadeOne(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + (r + 20) + ", " + (g + 14) + ", " + (b + 10) + ", " + alpha + ")";
        } else {
            return "rgb(" + (r + 20) + ", " + (g + 14) + ", " + (b + 10) + ")";
        }
    }
    var themeShade1 = shadeOne(color);
    document.documentElement.style.setProperty('--theme-shade1-color', themeShade1);

    function shade2(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + (r - 27) + ", " + (g - 30) + ", " + (b - 32) + ", " + alpha + ")";
        } else {
            return "rgb(" + (r - 27) + ", " + (g - 30) + ", " + (b - 32) + ")";
        }
    }
    var themeShade2 = shade2(color);
    document.documentElement.style.setProperty('--theme-shade2-color', themeShade2);

    function shade3(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + (r - 38) + ", " + (g - 44) + ", " + (b - 50) + ", " + alpha + ")";
        } else {
            return "rgb(" + (r - 38) + ", " + (g - 44) + ", " + (b - 50) + ")";
        }
    }
    var themeShade3 = shade3(color);
    document.documentElement.style.setProperty('--theme-shade3-color', themeShade3);

    // --theme-button-color:rgba(154, 241, 170, 0.5); 
    // --transparent-color:transparent;  
    // --white-color:#fff;
    // --font-color:#626262;
    // --white-font-color:#fff;
    // --orange-font-color:#fb7e75;
    // rgb(202, 241, 240);


    document.documentElement.style.setProperty('--theme-button-color', 'rgba(154, 241, 170, 0.5)');
    document.documentElement.style.setProperty('--transparent-color', 'transparent');
    document.documentElement.style.setProperty('--white-color', '#fff');
    document.documentElement.style.setProperty('--font-color', '#626262');
    document.documentElement.style.setProperty('--white-font-color', '#fff');
    document.documentElement.style.setProperty('--orange-font-color', '#fb7e75');
    document.documentElement.style.setProperty('--delete-btn-color', '#fb7e75');



    // rgba(69, 83, 98, 0.5)
    // rgb(31, 39, 48);

}






// colorsGradientIn('#7cdeb6','#55c7da');
function colorsGradientIn(color1, color2) {
    document.documentElement.style.setProperty('--theme-GradShade1-color', color1);
    document.documentElement.style.setProperty('--theme-GradShade2-color', color2);


    function gradientOne(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + (r + 70) + ", " + (g + 16) + ", " + (b + 52) + ", " + alpha + ")";
        } else {
            return "rgb(" + (r + 70) + ", " + (g + 16) + ", " + (b + 52) + ")";
        }
    }
    var gradientShade = gradientOne(color1);
    document.documentElement.style.setProperty('--mob-Banner-color', gradientShade);
    // rgb(144, 236, 192);
    // rgb(194, 238, 234)

}



function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function sideBtnClick($event) {
    var clickDiv = $event.target;
    var clickState = hasClass($event.target, "mat-button-wrapper");
    var clickState1 = hasClass($event.target, "mat-button");
    if (clickState == true) {
        $($event.target.parentElement.parentElement.children).removeClass("active");
        $($event.target.parentElement).addClass("active");
    } else if (clickState1 == true) {
        $($event.target.parentElement.children).removeClass("active");
        $($event.target).addClass("active");
    }





    // console.log("clickDiv");
    // console.log(clickDiv);


}


function messageIn() {
    // $('.msgBox').toggleClass('displayMsgBox');
}

// chatBox

function msgBox() {
    hideChat(1);
    $('#prime').click(function () {
        toggleFab();
    });
    // $('.msgsEach').click(function () {
    //     alert("click");
    //     $('.chat').toggleClass('is-visible');
    // });
    function toggleFab() {
        $('.prime').toggleClass('fa-comment-o');
        $('.prime').toggleClass('fa-times');
        $('.prime').toggleClass('is-active');
        $('.prime').toggleClass('is-visible');
        $('#prime').toggleClass('is-float');
        $('.chat').toggleClass('is-visible');
        $('.fab').toggleClass('is-visible');
    }

    $('#chat_fullscreen_loader').click(function (e) {
        $('#prime').toggleClass('displayNone');
        $('.fullscreen').toggleClass('fa-window-maximize');
        $('.fullscreen').toggleClass('fa-window-minimize');
        $('.chat').toggleClass('chat_fullscreen');
        $('.fab').toggleClass('is-hide');
        $('.header_img').toggleClass('change_img');
        $('.img_container').toggleClass('change_img');
        $('.chat_header').toggleClass('chat_header2');
        $('.fab_field').toggleClass('fab_field2');
        $('.chat_converse').toggleClass('chat_converse2');
    });

    function hideChat(hide) {
        switch (hide) {
            case 1:
                $('#chat_converse').css('display', 'block');
                $('#chat_body').css('display', 'none');
                $('#chat_form').css('display', 'none');
                $('.chat_login').css('display', 'none');
                $('.chat_fullscreen_loader').css('display', 'block');
                break;

        }
    }


    function listMsgBox(msgList) {
    }






}






// validations



