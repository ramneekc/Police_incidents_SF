from __future__ import print_function
import pymongo
import pandas as pd
from flask import Flask, jsonify, render_template, request
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
    return render_template('index.html')

@app.route('/leaflet')
def leaflet():
    data = dumps(collection.find())
    return data

@app.route('/names')
def search():
    data0 = collection.find()
    df =  pd.DataFrame(list(data0))
    df1 = df['Police_Dist'].unique()
    return jsonify(list(df1))

# @app.route('/geojson')
# def geojson():
#     link  = "static/Police_Department_Incident_Reports_ 2018_to_Present.geojson"
#     with open(link) as json_file:
#         data1 = json.load(json_file)
#     return data1

@app.route('/districts')
def districts():
    link  = "static/Current_Police_Districts.geojson"
    with open(link) as json_file:
        data2 = json.load(json_file)
    return data2    

@app.route('/samples/<newSample>')
def samples(newSample):
    data3 = dumps(collection.find({"Police_Dist": newSample}))
    return data3

@app.route('/category_names')
def search2():
    data0 = collection.find()
    df =  pd.DataFrame(list(data0))
    df1 = df['Category'].unique()
    return jsonify(list(df1))

@app.route('/categories/<newCategories>')
def samples2(newCategories):
    data4 = dumps(collection.find({"Category": newCategories}))
    return data4

if __name__ == "__main__":
    app.run()