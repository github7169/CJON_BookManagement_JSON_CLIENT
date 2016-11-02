
    var resultArray = [];

    $(function() {

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
                },
                error: function() {
                    alert("error");
                }
            });
        }
    }

    function getBookList(result) {

        for(var i=0; i<result.length; i++)
        {
            var tr = $("<tr></tr>").attr("data-isbn", result[i].isbn);
            var img = $("<img />").attr("src", result[i].img);
            var imgtd = $("<td></td>").append(img);
            var titletd = $("<td></td>").text(result[i].title);
            var authortd = $("<td></td>").text(result[i].author);
            var pricetd = $("<td></td>").text(result[i].price);

            // delete
            var deletetd = $("<td><input type='button' class='btn btn-danger' value='삭제' onclick='deleteLine(this)'></td>");

            // update
            var updatebtn = $("<input />").attr("type", "button").attr("value","수정").attr("class","btn btn-warning");
            updatebtn.on("click", update );

            var updatetd = $("<td></td>").append(updatebtn);

            tr.append(imgtd);
            tr.append(titletd);
            tr.append(titletd);
            tr.append(authortd);
            tr.append(pricetd);
            tr.append(deletetd);
            tr.append(updatetd);

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
                img: $("#img").attr("src") ,
                title: $("#title").val(),
                author: $("#author").val(),
                price: $("#price").val()
            },
            success: function (result) {
                if( result == true )
                    alert("성공!");
            },
            error: function () {
                alert("error");
            }
        });


        /*        var price = $(this).parent().parent().find("td:nth-child(4)");
        var updatebox = $("<input/>").attr("type","text").attr("size","10").val(price.text());

        updatebox.on("keyup",function () {
            if(event.keyCode == 13){

                alert("enter");

                var isbn = $(this).parent().parent().attr("data-isbn");
                var inputPrice = $(this).val();
                var tr = $(this).parent().parent();
                $.ajax({
                    url: "http://localhost:7070/book/bookUpdate",
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        isbn: isbn,
                        price: inputPrice
                    },
                    success: function (result) {
                        if( result == true )
                            alert("성공!");
                        tr.find("td:nth-child(4)").empty();
                        tr.find("td:nth-child(4)").text(inputPrice);
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
        })
        */
    }

    function update() {

        // price 위치 찾기
        var price = $(this).parent().parent().find("td:nth-child(4)");
        var updatebox = $("<input/>").attr("type","text").attr("size","10").val(price.text());

        updatebox.on("keyup",function () {
            if(event.keyCode == 13){

                alert("enter");

                var isbn = $(this).parent().parent().attr("data-isbn");
                var inputPrice = $(this).val();
                var tr = $(this).parent().parent();
                $.ajax({
                    url: "http://localhost:7070/book/bookUpdate",
                    type: "GET",
                    dataType: "jsonp",
                    jsonp: "callback",
                    data: {
                        isbn: isbn,
                        price: inputPrice
                    },
                    success: function (result) {
                        if( result == true )
                            alert("성공!");
                        tr.find("td:nth-child(4)").empty();
                        tr.find("td:nth-child(4)").text(inputPrice);
                    },
                    error: function () {
                        alert("error");
                    }
                });
            }
        })

        price.text("");
        price.append(updatebox);
        // 버튼 활성화 불가
        $(this).parent().parent().find("[type=button]").attr("disabled", "disabled");

    }

    function deleteLine(obj) {
        $(obj).parent().parent().remove();
    }

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
    }