
    $(function() {

        /* Session */
        $.ajax({
            url: "http://localhost:7070/book/loginCheck",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {

            },
            success: function (result) {

                // 로그인했을 경우 화면 변경
                if( result.status == 'true' ){

                    //화면상 로그인 버튼 삭제
                    $('#loginDiv').empty();

                    var welcome =$('<p>Welcome!</p>');
                    var email = $('<p></p>').text(result.email);

                    $('#loginDiv').append(welcome);
                    $('#loginDiv').append(email);

                    //로그아웃 버튼 생성
                    var logoutli = $("<li><a class='page-scroll' href='#' onclick='logout()'>Logout</a></li>")
                    $('#bs-example-navbar-collapse-1 > ul').append(logoutli);
                }

            },
            error: function () {
                alert("error");
            }
        });


        /* Modal */

        Confirm.init();

        $('#joinBtn').unbind();
        $('#joinBtn').bind('click', function(e)
        {
            e.preventDefault();
            Confirm.show('Welcome', '<h5>Name &nbsp;</h5><input type="text" size="30" id="username">'
                                        +'<h5>Email &nbsp;</h5><input type="email" size="30" id="useremail">'
                                        +'<h5>Password &nbsp;</h5><input type="password" size="30" id="userpassword"><br><br>', {
                'Join' : {
                    'primary' : true,
                    'callback' : function()
                    {
                        // user 입력값 전송
                        $.ajax({
                            url: "http://localhost:7070/book/userInsert",
                            type: "GET",
                            dataType: "jsonp",
                            jsonp: "callback",
                            data: {
                                id: $("#username").val(),
                                email: $("#useremail").val(),
                                pw: $("#userpassword").val()
                            },
                            success: function (result) {
                                if( result == true ){
                                    console.log("가입 성공");
                                }
                            },
                            error: function () {
                                alert("error");
                            }
                        });
                        Confirm.show('Message', '가입되었습니다. 반가워요');
                    }
                }
            });
        });

    });

    var Confirm = {

        modalContainerId : '#modal-container',
        modalBackgroundId : '#modal-background',
        modalMainId : '#confirm-modal',
        customButton : {
            'Okay' :
            {
                'primary' : true,
                'callback' : function()
                {
                    Confirm.hide();
                }
            }
        },
        customEvent : null,

        init : function()
        {
            var self = this;
            var ElemHtml = '';

            $(self.modalMainId).remove();

            ElemHtml = '<div id="confirm-modal" class="modal fade role="dialog" tabindex="-1">'
                +     '<div class="modal-dialog modal-sm">'
                +		 '<div class="modal-content">'
                +				'<div class="modal-header">'
                +					'<button id="modal-upper-close" class="close modal-close" aria-label="Close" type="button">'
                +						'<span aria-hidden="true">×</span>'
                +					'</button>'
                +					'<h4 id="modal-title" class="modal-title">Modal</h4>'
                +				'</div>'
                +				'<div id="modal-body" class="modal-body"> E-mail <input type="email" size="30"> </div>'
                +		        '<div id="modal-footer" class="modal-footer">'
                +		        '</div>'
                +			'</div>'
                +		'</div>'
                +	'</div>'
                +  '<div id="modal-background" class=""></div>';

            $('body').append(ElemHtml);
        },

        addCustomButtons : function()
        {
            var self = this;
            var condition = true;

            $('.modal-custom-button').remove();

            closeButton =  '';

            if(self.customButton)
                closeButton =  '<button id="modal-close" type="button" class="btn btn-default modal-custom-button">Close</button>';
            else
            {
                self.customButton = {
                    'Okay' :
                    {
                        'primary' : true,
                        'callback' : function()
                        {
                            Confirm.hide();
                        }
                    }
                };
            }

            $.each(self.customButton, function(key, val)
            {
                buttonName = key.replace(/ /g, '');

                var ElemHtml = '';
                var ButtonState = 'btn-default';

                if(val['primary'])
                    ButtonState = 'btn-primary';
                if(buttonName.toLowerCase() == 'okay' || buttonName.toLowerCase() == 'ok')
                    closeButton = '';

                if(buttonName.toLowerCase() == 'delete' || buttonName.toLowerCase() == 'remove')
                    ButtonState = 'btn-danger';

                ElemHtml = closeButton
                    + '<button id="button-'+ buttonName.toLowerCase() +'" type="button" class="btn modal-custom-button '+ ButtonState +'">'+ buttonName +'</button>';

                $('#modal-footer').append(ElemHtml);

                if($('#modal-close'))
                    closeButton = '';

                self.addCustomButtonEvents(buttonName.toLowerCase(), val['callback']);
            });

            $('#modal-upper-close').unbind();
            $('#modal-upper-close').bind('click', function(e)
            {
                e.preventDefault();
                self.hide();
            });

            $('#modal-close').unbind();
            $('#modal-close').bind('click', function(e)
            {
                e.preventDefault();
                self.hide();
            });
        },

        addCustomButtonEvents : function(customButtonId, callback)
        {
            var self = this;

            $('#button-'+customButtonId).unbind();
            $('#button-'+customButtonId).bind('click', function(e)
            {
                e.preventDefault();
                callback();
            });
        },

        show : function(title, message, customEvent)
        {
            var self = this;

            if(title)
                $('#modal-title').html(title);

            if(message)
                $('#modal-body').html(message);

            self.customButton = customEvent;

            $(self.modalMainId).addClass('in');
            $(self.modalBackgroundId).addClass('modal-backdrop fade in');
            $(self.modalMainId).css({
                'display' : 'block',
                'padding-right' : '17px'
            });
            self.addCustomButtons();
        },

        hide : function()
        {
            var self = this;

            $(self.modalMainId).removeClass('in');
            $(self.modalBackgroundId).removeClass('modal-backdrop fade in');

            $(self.modalMainId).css('display', 'none');
        }
    };

    // Login Function
    function login() {

        $.ajax({
            url: "http://localhost:7070/book/login",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                email: $(".userInput:first").val(),
                pw: $(".userInput:last").val()
            },
            success: function (result) {
                if( result ==  true ) {
                    console.log("로그인 성공");
                    $(location).attr('href','main.html');
                } else {
                    alert("로그인 오류, 다시 로그인해주세요");
                    $(".userInput:first").val("");
                    $(".userInput:last").val("");
                }
            },
            error: function () {
                alert("error");
            }
        });
    }

    function logout() {

        $(location).attr('href','http://localhost:7070/book/logout');
        console.log("로그아웃");
    }