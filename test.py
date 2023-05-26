#coding:utf8

import sys
import random

from flask import Flask,Blueprint,render_template,request,redirect,jsonify
from werkzeug.wrappers import Response
from flasgger import Swagger,swag_from
from aria2api import aria2API

app = Flask(__name__)
Swagger(app)

def matchingValues(dictionary, searchString):
    return [val for val in dictionary.values() if any(searchString in s for s in val)]

class JSONResponse(Response):
     default_mimetype = 'application/json'

     @classmethod
     def force_type(cls,response,environ=None):
         #print(response)
         a = matchingValues( response, "apispec_1.json")
         print(type(a))
         if isinstance(response,dict) :
             response = jsonify(response)
         return super(JSONResponse,cls).force_type(response,environ)

#app.response_class = JSONResponse

#app.add_url_rule('/', endpoint=index,defaults={'langueage':'java'})

#@app.route('/api/<string:language>/', methods=['GET'])
# def index(language):
#     """
#     This is the language awesomeness API
#     Call this api passing a language name and get back its features
#     ---
#     tags:
#       - Awesomeness Language API
#     parameters:
#       - name: language
#         in: path
#         type: string
#         required: true
#         description: The language name
#       - name: size
#         in: query
#         type: integer
#         description: size of awesomeness
#     responses:
#       500:
#         description: Error The language is not awesome!
#       200:
#         description: A language with its awesomeness
#         schema:
#           id: awesome
#           properties:
#             language:
#               type: string
#               description: The language name
#               default: Lua
#             features:
#               type: array
#               description: The awesomeness list
#               items:
#                 type: string
#               default: ["perfect", "simple", "lovely"]

#     """

#     language = language.lower().strip()
#     features = [
#         "awesome", "great", "dynamic", 
#         "simple", "powerful", "amazing", 
#         "perfect", "beauty", "lovely"
#     ]
#     size = int(request.args.get('size', 1))
#     if language in ['php', 'vb', 'visualbasic', 'actionscript']:
#         return "An error occurred, invalid language for awesomeness", 500
#     return jsonify(
#         language=language,
#         features=random.sample(features, size)
#     )

@app.route('/aria2/<string:method>', methods=['GET'])
def aria2Status(method):
    """
    This is the aria2 API
    Call this api passing a aria2 method and get back its result
    ---
    tags:
      - Aria2 API
    parameters:
      - name: method
        in: path
        type: string
        required: true
        enum: [ "getGlobalStat","tellActive","tellStatus",'getGlobalOption','removeDownloadResult','remove','tellWaiting','shutdown','addUri' ]      
        description: aria2 method
      - name: gid
        in: query
        type: string
        description: gid of the aria2 tasks
      - name: num
        in: query
        type: string
        description: num of tasks to retrieve
      - name : uri
        in: query
        type: string
        description: uri of file to be download
    responses:
      500:
        description: Error from aria2!
      200:
        description: aria2 RPCAPI result
        schema:
          id: aria2
          properties:            
            result:
              type: array / json object
              description: aria2 result json
              items:
                type: string
              default: ["perfect", "simple", "lovely"]
    """
    params = []
    reply=[]
    opt = method.lower()
    ret = 0
    if request.method == 'GET':
        if opt in ['getglobalstat','tellactive','getglobaloption','purgedownloadresult']:
            pass
        elif opt in ['tellstatus','remove','removedownloadresult','tellwaiting']:
            gid = request.args.get('gid')
            params.append(str(gid))
            if opt =='tellwaiting':
                num = request.args.get('num')
                params.pop()
                params.append(int(gid))
                params.append(int(num))
        elif opt in ['adduri']:
            uri = request.args.get('uri')
            inner = list()
            inner.append(uri)
            params.append(inner)        

        ret = aria2.invoke(method,params,reply)
        
        return  reply[0]




aria2 = aria2API("http://192.168.1.69:6800/jsonrpc",False)
app.run(debug=True)
