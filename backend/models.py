from main import db

class Poll(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    options = db.Column(db.JSON, nullable=False)
    end = db.Column(db.DateTime, nullable=True)
    start = db.Column(db.DateTime, nullable=False)
    # List of UUIDs representing users who have voted in the poll
    uuids = db.Column(db.JSON, nullable=False)

def __repr__(self):
    return f'<Poll {self.id}>'