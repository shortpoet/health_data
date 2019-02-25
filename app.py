from flask import Flask, render_template, redirect, Markup, url_for, jsonify
from flask_pymongo import PyMongo
from bson import json_util
import json
import re
from datetime import datetime as dt

app = Flask(__name__)


# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/health_data"
mongo = PyMongo(app)

# Or set inline
# mongo = PyMongo(app, uri="mongodb://localhost:27017/social_blade")



# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='192.168.1.118', port='5000', debug=True)

