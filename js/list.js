
    var resultArray = [];
    var sessionEmail = "";

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

                    sessionEmail = result.email; // 세션아이디 전역변수로 저장

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

        // image file load
        var imageLoader = document.getElementById('filePhoto');
        imageLoader.addEventListener('change', handleImage, false);

        function handleImage(e) {
            var reader = new FileReader();
            reader.onload = function (event) {
                $('.uploader img').attr('src',event.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });


    function search() {
        if(event.keyCode == 13) {

            $.ajax({
                url: "http://localhost:7070/book/bookList",
                type: "GET",
                dataType: "jsonp",
                jsonp: "callback",
                data: {
                    keyword: $(".form-control").val()
                },
                success: function(result){

                    resultArray = result;
                    getBookList(resultArray);

                    // Paging 처리
                    $('#example').DataTable({
                        "pagingType": "full_numbers"
                    });
                },
                error: function() {
                    alert("error");
                }
            });
        }
    }

    function getBookList(result) {

        $('tbody tr').remove();

        for(var i=0; i<result.length; i++)
        {
            var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);
            var img = $("<img width='130px' />").attr("src", result[i].img);
            var imgtd = $("<td></td>").append(img);
            var authortd = $("<td></td>").text(result[i].author);
            var pricetd = $("<td></td>").text(result[i].price);


            // title - detail
            var title = $("<p></p>").text(result[i].title);
            var detaildiv = $("<div id='detailDiv'></div>");

            var detailbtn = $("<input />").attr("type", "button").attr("value","상세보기").attr("class","btn btn-info");
            detailbtn.on("click", detail );
            detaildiv.append(detailbtn);

            var titletd = $("<td></td>").append(title);
            titletd.append(detaildiv);



            // delete
            var deletebtn = $("<input />").attr("type", "button").attr("value","삭제").attr("class","btn btn-danger");
            deletebtn.on("click", delete2 );
            var deletetd = $("<td></td>").append(deletebtn);

            // update
            var updatebtn = $("<input />").attr("type", "button").attr("value","수정").attr("class","btn btn-warning");
            updatebtn.on("click", update );
            var updatetd = $("<td></td>").append(updatebtn);

            // 서평
            var reviewbtn = $("<input />").attr("type", "button").attr("value","서평").attr("class","btn btn-success");
            reviewbtn.on("click", review );
            var reviewtd = $("<td></td>").append(reviewbtn);

            // 대여
            var statustd = $("<td></td>");
            if( result[i].status != null ){
                statustd.text("대여중");
            } else {
                var rentbtn = $("<input />").attr("type", "button").attr("value","대여가능").attr("class","btn btn-info");
                rentbtn.on("click", rent );
                statustd.append(rentbtn);
            }

            // 대여자
            var usertd = $("<td></td>").text(result[i].email);

            tr.append(imgtd);
            tr.append(titletd);
            tr.append(authortd);
            tr.append(pricetd);
            tr.append(deletetd);
            tr.append(updatetd);
            tr.append(reviewtd);
            tr.append(statustd);
            tr.append(usertd);

            $("tbody").append(tr);
        }
    }

    function insert() {

        // 입력값 Server에 전송
        $.ajax({
            url: "http://localhost:7070/book/bookInsert",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: $("#isbn").val(),
                img: $("#img").attr("src") ,
                title: $("#title").val(),
                author: $("#author").val(),
                price: $("#price").val()
            },
            success: function (result) {
                if( result == true ){
                    alert("책이 등록되었습니다. Book Title : " + $("#title").val() );
                }
            },
            error: function () {
                alert("error");
            }
        });

    }

    function update() {
        // 수정할 값 위치 찾기
        var obj = $(this).parent().parent(); // this : tr
        var title = obj.find("td:nth-child(2)");
        var author = obj.find("td:nth-child(3)");
        var price = obj.find("td:nth-child(4)");

        // 버튼이 '수정' 상태일 때
        if( obj.find("td:nth-child(6)").find("[value]").val() == "수정" ){
            console.log("수정");

            // 수정 텍스트창을 띄움
            var titlebox = $("<input/>").attr("type", "text").val(title.find('p').text());
            var authorbox = $("<input/>").attr("type", "text").val(author.text());
            var pricebox = $("<input/>").attr("type", "text").val(price.text());

            // 텍스트창 위에 있는 글자는 지움
            title.text("");
            author.text("");
            price.text("");

            title.append(titlebox);
            author.append(authorbox);
            price.append(pricebox);

            // 수정 버튼
            var updatebt = obj.find("td:nth-child(6)");
            updatebt.find("[value]").val("수정완료");
            // alert( updatebt.find("[value]").val() );
            obj.find("td:nth-child(5)").find("[type=button]").attr("disabled", "disabled");
            
        // 버튼이 '수정완료' 상태일 때
         } else if( obj.find("td:nth-child(6)").find("[value]").val() == "수정완료"  ){

                // isbn 받아오고 입력값 3개 받아옴
                console.log("수정완료");
                var isbn = obj.attr("data-isbn");

                $.ajax({
                    url: "http://localhost:7070/book/bookUpdate",
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        isbn: isbn,
                        title: title.find("[type]").val(),
                        author: author.find("[type]").val(),
                        price: price.find("[type]").val()
                    },
                    success: function (result) {
                        if( result == true ) {
                            console.log("성공!");

                            // 리스트지우기

                            var titlep = $("<p></p>").text(title.find("[type]").val());
                            title.empty();
                            title.append(titlep);
                            author.text(author.find("[type]").val());
                            price.text(price.find("[type]").val());

                            obj.find("td:nth-child(6)").find("[value]").val("수정");
                            obj.find("td:nth-child(5)").find("[type=button]").attr("disabled", false);
                        }
                    },
                    error: function () {
                        alert("error");
                    }
                });
        }
    }

    function delete2( ){

        var obj = this;
        var isbn = $(this).parent().parent().attr("data-isbn");

        alert(isbn);

        $.ajax({
            url: "http://localhost:7070/book/bookDelete",
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

    function detail() {

        var obj = $(this);
        var isbn = $(this).parent().parent().parent().attr("data-isbn");

        $.ajax({
            url: "http://localhost:7070/book/bookDetail",
            type: "GET",
            dataType: "jsonp",
            jsonp: "callback",
            data: {
                isbn: isbn
            },
            success: function(result){

                var div = $(obj).parent().parent().find('#detailDiv');

                obj.parent().empty();

                // div 안에 span으로 값 출력
                div.append($("<h6></h6>"));
                div.append($("<h6></h6>"));
                div.append($("<h6></h6>"));
                div.append($("<h6></h6>"));

                div.find('h6:first').text("페이지수 : "+result[0].page);
                div.find('h6:nth-child(2)').text("번역가 : "+result[0].translator);
                div.find('h6:nth-child(3)').text("참고 : "+result[0].supplement);
                div.find('h6:last').text("출판사 : "+result[0].publisher);

                // 상세보기 버튼 비활성화
                //obj.off();
            },
            error: function() {
                alert("error");
            }
        });
    }
    
    function review() {
        // 해당 책 정보를 Local Storage 에 저장
        var obj = $(this).parent().parent(); // this : tr
        var isbn = obj.attr("data-isbn");
        var imgsrc = obj.find("td:nth-child(1) > img").attr("src");
        var titletxt = obj.find("td:nth-child(2)").text();
        var authortxt = obj.find("td:nth-child(3)").text();
        var pricetxt = obj.find("td:nth-child(4)").text();

        var bookInfoList = { "isbn": isbn, "img": imgsrc, "title": titletxt, "author": authortxt, "price": pricetxt }
        localStorage.setItem('lists', JSON.stringify(bookInfoList));

        $(location).attr('href','review.html');
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

        // 해당 책의 상태가 대여 가능 (insert)
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

                                // 화면에 대여가능 -> 대여중으로 변경, 아이디 기재
                                obj.find('td:nth-child(8)').text("대여중");
                                obj.find('td:nth-child(9)').text(sessionEmail);
                                
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
    }

    /*
    function mySort(type) {

        // sort
        if(type == 'up') {
            resultArray.sort(function(a, b){return b.price - a.price});
        } else if(type == 'down'){
            resultArray.sort(function(a, b){return a.price - b.price});
        }

        // list update
        $('tbody tr').remove();
        getBookList(resultArray);
    }*/