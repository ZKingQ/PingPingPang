import json

from django.http import HttpResponse
from qcloud_image import Client
from qcloud_image import CIUrl

from django.views.decorators.csrf import csrf_exempt


# 不检查cookie
@csrf_exempt
def AI(request):
    appid = '10114533'
    secret_id = 'AKIDpZ8Xpx1sj6JUcaaCXnuwpX353rU0JmLo'
    secret_key = 'YxDLUaYKzUo053ymPwkhaIAxa4FMMUca'
    bucket = 'web'
    client = Client(appid, secret_id, secret_key, bucket)
    client.use_http()
    client.set_timeout(30)
    # 单个图片Url, mode:1为检测最大的人脸 , 0为检测所有人脸
    photo_url = str(request.POST.get('url'))
    # print(photo_url)
    # 单个图片file, mode:1为检测最大的人脸 , 0为检测所有人脸
    data = client.face_detect(CIUrl(photo_url), 1)
    # print(data)
    # print(data.get('data'))
    # print(data.get('data').get('face'))
    # print(data.get('data').get('face')[0].get('beauty'))
    # print(data.get('data').get('face')[0].get('gender'))
    # print(data.get('data').get('face')[0].get('age'))
    # print(data.get('data').get('face')[0].get('expression'))
    return HttpResponse(json.dumps(data), content_type='jsonp')
