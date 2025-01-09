from flask import Flask, Blueprint, request, jsonify
from secrets import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
import flask_sqlalchemy
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import uuid
from datetime import datetime, timedelta
import logging
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import event
from sqlalchemy.orm import session
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
import json

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)

main_blueprint = Blueprint('main', __name__)

engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}')

def get_db_connection():
    try:
        connection = engine.connect()
        return connection
    except OperationalError as err:
        print(f"OperationalError: {err}")
        return None

@app.route('/api/poll', methods=['GET', 'POST'])
def poll():
    connection = get_db_connection()
    if request.method == 'GET':
        body = request.args
    else:
        body = request.get_json()
    
    if request.method == 'GET':
        if not body.get("id"):
            return jsonify({"error": "No poll ID provided"}), 400
        poll_id = body["id"]
        
        poll = connection.execute(text("SELECT * FROM polls WHERE id = :id"), {'id': poll_id}).fetchone() 
        if not poll:
            return jsonify({"error": "Poll not found"}), 404

        options = sorted(poll.answers, key=poll.answers.get)
        
        connection.close()
        return jsonify({
            "question": poll.question,
            "options": options,
            "end": poll.end_timestamp,
            "hasVoted": body.get("uuid") in poll.uuids,
            "background": poll.background
        }), 200
        
    elif request.method == 'POST':
        current_timestamp = datetime.now()
        formatted_timestamp = current_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        questions_dict = {question: 0 for question in body["questions"]}
        
        new_poll = {
            "question": body["title"],
            "answers": json.dumps(questions_dict),
            "start_timestamp": formatted_timestamp,
            "end_timestamp": (datetime.now() + timedelta(seconds=body.get("expiry", 0))).strftime('%Y-%m-%d %H:%M:%S'),
            "check_uuid": not body["allowMultipleVotes"],
            "uuids": json.dumps([]),
            "background": body["background"]
        }
        
        connection.execute(text("INSERT INTO polls (question, answers, start_timestamp, end_timestamp, check_uuid, uuids, background) VALUES (:question, :answers, :start_timestamp, :end_timestamp, :check_uuid, :uuids, :background)"), new_poll)
        connection.commit()
        
    poll_id = connection.execute(text("SELECT LAST_INSERT_ID()")).fetchone()[0]
    connection.close()
    return jsonify({"message": "Poll successfully created", "id": poll_id}), 200

@app.route('/api/poll/<poll_id>/vote', methods=['POST'])
def vote(poll_id):
    connection = get_db_connection()
    body = request.get_json()

    if not body.get("uuid"):
        return jsonify({"error": "No UUID provided"}), 400
    if not body.get("option"):
        return jsonify({"error": "No option provided"}), 400
    
    poll = connection.execute(text("SELECT * FROM polls WHERE id = :id"), {'id': poll_id}).fetchone() 
    if not poll:
        return jsonify({"error": "Poll not found"}), 404

    if poll.check_uuid and body["uuid"] in poll.uuids:
        return jsonify({"error": "User has already voted"}), 403
    
    if body["option"] not in poll.answers:
        return jsonify({"error": "Option not found"}), 404

    connection.execute(text("UPDATE polls SET answers = JSON_SET(answers, :option, JSON_EXTRACT(answers, :option) + 1) WHERE id = :id"), {'option': f'$.{body["option"]}', 'id': poll_id})
    
    if poll.check_uuid:
        connection.execute(text("UPDATE polls SET uuids = JSON_ARRAY_APPEND(uuids, '$', :uuid) WHERE id = :id"), {'uuid': body["uuid"], 'id': poll_id})
    
    connection.commit()
    connection.close()
    
    return jsonify({"message": "Vote successfully registered"}), 200

@app.route('/api/poll/<poll_id>/results', methods=['GET'])
def results(poll_id):
    connection = get_db_connection()
    poll = connection.execute(text("SELECT * FROM polls WHERE id = :id"), {'id': poll_id}).fetchone()
    if not poll:
        return jsonify({"error": "Poll not found"}), 404

    return({
        "question": poll.question,
        "options": poll.answers,
        "background": poll.background
    }), 200

app.register_blueprint(main_blueprint)

