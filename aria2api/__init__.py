# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import requests
from flask import Flask, jsonify, request

class aria2API:
    _endpoint = "http://localhost:6800/jsonrpc"
    _bSecure = False
    _token = ""

    def __init__(self,endpoint,bSecure):
        self._endpoint = endpoint
        self._bSecure = bSecure

    def invoke(self,method,params,reply) -> int:
        headers = {
           "Content-Type": "application/json"  
        }
        payload = {
            "jsonrpc":"2.0",
            "id":"aria2",
            "method":'aria2.'+method,
            "params":params
            }
        #print(self._endpoint)
        print(payload)
        r = requests.Response()

        try:
            r = requests.post(self._endpoint, headers=headers,json=payload)

            if r.status_code == 200:
                reply.append(r.json())             
        except :
            reply.append(f"aria2 server {self._endpoint} connection timeout , probably down !!")    
            r.status_code = 500
        finally:
            return r.status_code
        

