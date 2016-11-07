
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

                // 로그인했을 경우 서평이 보이고, 아니면 메인으로 감
                if( result.status == 'true' ){

                    //로그아웃 버튼 생성
                    var logoutli = $("<li><a class='page-scroll' href='#' onclick='logout()'>Logout</a></li>")
                    $('#bs-example-navbar-collapse-1 > ul').append(logoutli);

                    // get book info
                    var bookInfoList = localStorage.getItem('lists');
                    var binfo = JSON.parse(bookInfoList);

                    $('#img').attr("src",binfo.img);
                    $('#title').text(binfo.title);
                    $('#author').text(binfo.author);
                    $('#price').text(binfo.price);

                    // get book review
                    $.ajax({
                        url: "http://localhost:7070/book/reviewList",
                        type: "GET",
                        dataType: "jsonp",
                        jsonp: "callback",
                        data: {
                            isbn: binfo.isbn
                        },
                        success: function(result2){

                            // 리뷰 리스트
                            for(var i=0; i<result2.length; i++) {

                                var tr = $("<tr></tr>").attr("review-no",result2[i].no);

                                var nametd = $("<td width='70'></td>").text(result2[i].name);
                                //var grade = $("<input type='range' min='0' max='5'>");
                                var grade = $("<progress min='0' max='5'>");
                                var gradetd = $("<td width='100'></td>").text(result2[i].grade+" ");
                                var contenttd = $("<td></td>").text(result2[i].content);
                                var datetd = $("<td width='120'></td>").text(result2[i].date);
                                var deletetd = $("<td width='20'></td>");

                                // 본인이 작성했을 경우 삭제버튼 생성
                                // 게시물의 아이디 == 현재 로그인한 아이디
                                if( result2[i].email ==  result.email){
                                    var deletebtn = $("<span class='glyphicon glyphicon-remove'></span>");
                                    deletebtn.on("click", deleteMyReview );
                                    deletetd.append(deletebtn);
                                }

                                grade.attr("value",result2[i].grade);
                                gradetd.append(grade);
                                tr.append(nametd);
                                tr.append(gradetd);
                                tr.append(contenttd);
                                tr.append(datetd);
                                tr.append(deletetd);

                                $("table:nth-child(2)").append(tr);
                            }

                            // 등록 창에 로그인 유저 이름 set
                            $('#name').text(result.email);
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

    function deleteMyReview() {

        var obj = this;
        var seq = $(this).parent().parent().attr("review-no");

        $.ajax({
            url: "http://localhost:7070/book/reviewDelete",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                seq: seq
            },
            success: function (result) {
                if( result == true ){;
                    // 화면상 삭제
                    $(obj).parent().parent().remove();
                }
            },
            error: function () {
                alert("error");
            }
        });

    }
    
    function insertMyReview() {

        var bookInfoList = localStorage.getItem('lists');
        var binfo = JSON.parse(bookInfoList);

        $.ajax({
            url: "http://localhost:7070/book/reviewInsert",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                grade: $('#grade').val(),
                content: $('#content').val(),
                email: $('#name').text(),
                isbn: binfo.isbn
            },
            success: function (result) {
                if( result == true ){
                    $(location).attr('href','review.html');
                }
            },
            error: function () {
                alert("error");
            }
        });
    }

    function keywordSearch() {
        if(event.keyCode == 13) {

            $.ajax({
                url: "http://localhost:7070/book/reviewSelect",
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

                        // btitle, member.mname, review.memail, rgrade, rcontent, rdate
                        var titletd = $("<td></td>").text(result[i].title);
                        var usertd = $("<td width='70'></td>").text(result[i].name + " (" + result[i].email + ")");
                        var grade = $("<progress min='0' max='5'>");
                        var gradetd = $("<td width='100'></td>").text(result[i].grade+" ");
                        var contenttd = $("<td></td>").text(result[i].content);
                        var datetd = $("<td width='120'></td>").text(result[i].date);
                        var deletetd = $("<td width='20'></td>");

                        grade.attr("value",result[i].grade);
                        gradetd.append(grade);
                        tr.append(titletd);
                        tr.append(usertd);
                        tr.append(gradetd);
                        tr.append(contenttd);
                        tr.append(datetd);
                        tr.append(deletetd);

                        $("table tbody").append(tr);
                    }

                },
                error: function() {
                    alert("error");
                }
            });
        }
    }
