from database import db

class Poll(db.Model):
    __tablename__ = 'polls'  # Explicitly set the table name
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    awnsers = db.Column(db.JSON, nullable=False)
    end_timestamp = db.Column(db.DateTime, nullable=True)
    start_timestamp = db.Column(db.DateTime, nullable=False)
    check_uuid = db.Column(db.Boolean, nullable=False, default=True)
    # List of UUIDs representing users who have voted in the poll
    uuids = db.Column(db.JSON, nullable=False)
    background = db.Column(db.String(10), nullable=False)

def __repr__(self):
    return f'<Poll {self.id}>'