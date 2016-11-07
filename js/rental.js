
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

                // 로그인했을 경우 나의 책 대여상황이 보임
                if( result.status == 'true' ){

                    //로그아웃 버튼 생성
                    var logoutli = $("<li><a class='page-scroll' href='#' onclick='logout()'>Logout</a></li>")
                    $('#bs-example-navbar-collapse-1 > ul').append(logoutli);

                    $.ajax({
                        url: "http://localhost:7070/book/rentalStatusMe",
                        type: "GET",
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            email: result.email
                        },
                        success: function(result2){

                            // 대여 리스트
                            if(result2.length) {
                                for(var i=0; i<result2.length; i++) {

                                    var tr = $("<tr></tr>").attr("data-isbn", result2[i].isbn);
                                    var titletd = $("<td></td>").text(result2[i].title);
                                    var authortd = $("<td></td>").text(result2[i].author);
                                    var returntd = $("<td><input type='button' value='반납' onclick='returnBook(this)'></td>");

                                    tr.append(titletd);
                                    tr.append(authortd);
                                    tr.append(returntd);

                                    $("#mystatus").append(tr);
                                }
                            } else {
                                $("#mystatus").append($("<tr>현재 대여중인 책이 없습니다.</tr>"));
                            }
                        },
                        error: function() {
                            alert("error : get book review ");
                        }
                    });

                } else {
                    alert("로그인하셈");
                    $(location).attr('href','main.html');
                }

            },
            error: function () {
                alert("error");
            }
        });

    });

    function returnBook(obj) {

       var isbn = $(obj).parent().parent().attr("data-isbn");

        $.ajax({
            url: "http://localhost:7070/book/rentalReturn",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn
            },
            success: function (result) {
                if( result == true ){;
                    // 화면상 삭제
                    console.log("성공!")
                    $(obj).parent().parent().remove();
                }
            },
            error: function () {
                alert("error");
            }
        });

    }

    function searchRental() {
        if(event.keyCode == 13) {

            $.ajax({
                url: "http://localhost:7070/book/rentalList",
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    keyword: $(".form-control").val()
                },
                success: function(result){

                    $('tbody tr').remove();

                    for(var i=0; i<result.length; i++)
                    {
                        var tr = $("<tr></tr>");
                        var img = $("<img width='130px' />").attr("src", result[i].img);
                        var imgtd = $("<td></td>").append(img);
                        var titletd = $("<td></td>").text(result[i].title);
                        var authortd = $("<td></td>").text(result[i].author);
                        var statustd = $("<td></td>");
                        var usertd = $("<td></td>").text(result[i].email);

                        // 대여
                        if( result[i].status != null ){
                            statustd.text("대여중");
                        } else {
                            var rentbtn = $("<input />").attr("type", "button").attr("value","대여가능").attr("class","btn btn-info");
                            rentbtn.on("click", rent );
                            statustd.append(rentbtn);
                        }

                        tr.append(imgtd);
                        tr.append(titletd);
                        tr.append(authortd);
                        tr.append(statustd);
                        tr.append(usertd);

                        $("tbody").append(tr);
                    }

                },
                error: function() {
                    alert("error");
                }
            });
        }
    }

    function rent() {

        var obj = $(this).parent().parent(); // this : tr
        var isbn = obj.attr("data-isbn");

        // 해당 책의 상태가 대여 가능이면 빌려주고 (insert), 이미 대여상태면 불가 alert
        $.ajax({
            url: "http://localhost:7070/book/rentalStatus",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn
            },
            success: function (result) {
                if( result == true ){
                    // 대여가능 상태이더라도 나는 한 권만 빌릴 수 있지......... ㅠ_ㅠ
                    $.ajax({
                        url: "http://localhost:7070/book/rentalStatusMe",
                        type: "GET",
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            email: sessionEmail
                        },
                        success: function (result2) {

                            // 대여 리스트
                            if (result2.length > 0) {
                                alert("이미 대여중인 책이 한 권있습니다. 한 사람당 한 권만 대여 가능합니다.");
                            } else {
                                // 대여 가능, insert
                                $.ajax({
                                    url: "http://localhost:7070/book/rentalInsert",
                                    type: "GET",
                                    dataType: "jsonp",
                                    jsonp: "callback",
                                    data: {
                                        email: sessionEmail,
                                        isbn: isbn
                                    },
                                    success: function (result) {
                                        if (result == true) {
                                            alert("책을 대여하였습니다.");
                                        }
                                    },
                                    error: function () {
                                        alert("error");
                                    }
                                });
                            }
                        },
                        error: function () {
                            alert("error");
                        }
                    });
                } else {
                    alert("죄송합니다. 대여중입니다.");
                }
            },
            error: function () {
                alert("error");
            }
        });
    }