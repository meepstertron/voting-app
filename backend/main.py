from flask import Flask, Blueprint, request, jsonify
from secrets import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
import flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import uuid
from database import db
from models import Poll
from datetime import datetime, timedelta



app = Flask(__name__)
CORS(app)



app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

main_blueprint = Blueprint('main', __name__)

@app.route('/api/poll' , methods=['GET', 'POST'])
def poll():
    if request.method == 'GET':
        body = request.args
    else:
        body = request.get_json()
    
    if request.method == 'GET':
        if not body.get("id"):
            return jsonify({"error": "No poll ID provided"}), 400
        poll_id = body["id"]
        
        
        return jsonify({
            "question": "What is your favorite color?",
            "options": ["Red", "Blue", "Green", "Yellow"],
            "end": "",
            "hasVoted": False,
            "background": "paint"
        }), 200
    elif request.method == 'POST':
        current_timestamp = datetime.now()
        formatted_timestamp = current_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        questions_dict = {question: 0 for question in body["questions"]}
        
        with app.app_context():
            new_poll = Poll(
                question=body["title"],
                awnsers=questions_dict,
                start_timestamp=formatted_timestamp,
                end_timestamp=(datetime.now() + timedelta(seconds=body.get("expiry", 0))).strftime('%Y-%m-%d %H:%M:%S'),
                check_uuid=not body["allowMultipleVotes"],
                uuids=[],
                background=body["background"]
            )
            db.session.add(new_poll)
            db.session.flush() 
        try:
            db.session.commit()
            return jsonify({"message": "Poll created", "id": new_poll.id}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "Failed to create poll", "details": str(e)}), 500
    return 

@app.route('/api/poll/<poll_id>/vote', methods=['POST'])
def vote(poll_id):
    body = request.get_json()
    # Add vote handling
    
    return jsonify({"message": "Vote received"}), 200


app.register_blueprint(main_blueprint)

