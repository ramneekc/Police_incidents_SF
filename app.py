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

@app.route('/dist_plots')
def dist_plots():
    # response = requests.get("https://data.sfgov.org/resource/evfd-nvbj.json")
    link  = "static/Historical_Police_Department_Reporting_Plots.geojson"
    with open(link) as json_file:
        data1 = json.load(json_file)
    return data1

if __name__ == "__main__":
    app.run()