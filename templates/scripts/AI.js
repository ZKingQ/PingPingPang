let Button = document.getElementById('SubmitURL'),
    URL = document.getElementById('URL'),
    bgm = document.getElementById('bgm'),
    bgmm = document.getElementById('bgmm');

function AI() {
    let url = URL.value;
    console.log(url);
    $.ajax({
        type: 'POST',
        url: 'http://172.17.151.4:80/ai/',
        // url: 'http://127.0.0.1:8000/ai/',
        dataType: "json",
        data: {
            'url': url
        },
        //请求成功的回调函数
        success: function (data) {
            res = data.data.face;
            gender = res[0].gender < 50 ? "woman" : "man";
            beauty = res[0].beauty;
            console.log('性别: ' + gender, '颜值: ' + beauty);
            Button.value = '性别' + gender + ' 颜值' + beauty;
            init();
            //函数参数 "data" 为请求成功服务端返回的数据
            // console.log(data);
        },
        fail: function (a, b, c) {
            console.log(b, c);
        }
    });
}

Button.addEventListener('mousedown', AI);