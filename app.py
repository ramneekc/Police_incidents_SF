from __future__ import print_function
import os
import pandas as pd
import numpy as np
import pymongo
from flask import Flask, jsonify, render_template
from bson.json_util import dumps, loads
import json
import requests

app = Flask(__name__)

# Create connection variable
conn = 'mongodb://localhost:27017'

# Pass connection to the pymongo instance.
client = pymongo.MongoClient(conn)

database = client.Police_reports
collection = database['Incidents']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/leaflet')
def leaflet():
    data = dumps(collection.find())
    return data

@app.route('/geojson')
def geojson():
    link  = "static/Police_Department_Incident_Reports_ 2018_to_Present.geojson"
    with open(link) as json_file:
        data1 = json.load(json_file)
    return data1

@app.route('/districts')
def districts():
    link  = "static/Current_Police_Districts.geojson"
    with open(link) as json_file:
        data2 = json.load(json_file)
    return data2    

if __name__ == "__main__":
    app.run()