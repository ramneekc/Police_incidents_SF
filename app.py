import os
import pandas as pd
import numpy as np
import pymongo
from flask import Flask, jsonify, render_template
from bson.json_util import dumps, loads
import json



app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

database = client.Police_reports
collection = database['Incidents']

@app.route('/')
def index():
    print("hello")
    return render_template('index.html')

@app.route('/leaflet')
def leaflet():
    data = dumps(collection.find())
#     data = loads(dumps(collection.find_one()))
    print("hello leaflet")
    # print(data)
#     data = collection.find_one()
#     print(data)
    return data
    # return render_template('index.html', data=data)

if __name__ == "__main__":
    app.run()