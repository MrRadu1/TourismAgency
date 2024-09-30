import datetime
from functools import wraps

import jwt
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import jsonify, request

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), unique=False, nullable=False)
    last_name = db.Column(db.String(120), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=False, nullable=False)
    role = db.Column(db.String(120), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username,
            'password': self.password,
            'role' : self.role
        }


class Destination(db.Model):
    __tablename__ = 'destinations'
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.Integer, nullable=False)
    discount = db.Column(db.Integer)
    v_type = db.Column(db.String(100), nullable=False)
    path = db.Column(db.String(255))
    best_month = db.Column(db.String(100))

    def __repr__(self):
        return f'<Destination {self.location}>'

    def serialize(self):
        return {
            'id': self.id,
            'location': self.location,
            'price': self.price,
            'availability': self.availability,
            'discount': self.discount,
            'v_type': self.v_type,
            'path': self.path,
            'best_month': self.best_month
        }

class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    reservation_date = db.Column(db.Date, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_cost = db.Column(db.Integer, nullable=False)
    user_username  = db.Column(db.String(50), db.ForeignKey('users.username'), nullable=False)

    def __repr__(self):
        return f'<Reservation {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'destination_id': self.destination_id,
            'reservation_date': self.reservation_date.strftime('%Y-%m-%d'),
            'start_date': self.start_date.strftime('%Y-%m-%d'),
            'end_date': self.end_date.strftime('%Y-%m-%d'),
            'total_cost': self.total_cost,
            'user_username': self.user_username
        }


def token_required(role=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'x-access-tokens' in request.headers:
                token = request.headers['x-access-tokens']

            if not token:
                return jsonify({'message': 'A valid token is missing'}), 401

            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = User.query.filter_by(username=data['username']).first()
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Token is invalid'}), 401

            if role and current_user.role != role:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/users', methods=['GET'])
@token_required(role='admin')
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users])

@app.route('/users/<int:user_id>', methods=['GET'])
@token_required(role='admin')
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.serialize())

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(first_name=data['first_name'], last_name=data['last_name'], email=data['email'], username=data['username'], password=data['password'],role='admin')
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
@token_required(role='admin')
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['username']
    user.email = data['email']
    user.password = data['password']
    db.session.commit()
    return jsonify(user.serialize())

@app.route('/users/<int:user_id>', methods=['DELETE'])
@token_required(role='admin')
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        token_data = {
            'username': user.username,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1500)
        }
        token = jwt.encode(token_data, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({'token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 404


@app.route('/destinations', methods=['GET'])
def get_destinations():
    destinations = Destination.query.all()
    return jsonify([destination.serialize() for destination in destinations])

@app.route('/destinations/<int:destination_id>', methods=['GET'])
def get_destination(destination_id):
    destination = Destination.query.get_or_404(destination_id)
    return jsonify(destination.serialize())


@app.route('/destinations', methods=['POST'])
@token_required(role='admin')
def create_destination():
    data = request.json
    discount = int(data['discount'])
    if discount != 0:
        v_type = 'top'
    if data['v_type'] == 'top' and discount == 0:
        v_type = 'normal'
    if data['v_type'] == 'top' and discount != 0:
        v_type = data['v_type']
    if data['v_type'] != 'top' and discount == 0:
        v_type = data['v_type']
    new_destination = Destination(
        location=data['location'],
        price=data['price'],
        availability=data['availability'],
        discount=discount,
        v_type=v_type,
        path=data['path'],
        best_month=data['best_month']
    )
    db.session.add(new_destination)
    db.session.commit()
    return jsonify(new_destination.serialize()), 201

@app.route('/destinations/<int:destination_id>', methods=['PUT'])
@token_required(role='admin')
def update_destination(destination_id):
    destination = Destination.query.get_or_404(destination_id)
    data = request.json
    discount = int(data['discount'])
    if discount != 0:
        v_type = 'top'
    if data['v_type'] == 'top' and discount == 0:
        v_type = 'normal'
    if  data['v_type']  == 'top' and discount != 0:
        v_type = data['v_type']
    if data['v_type'] != 'top' and discount == 0:
        v_type = data['v_type']
    destination.location = data['location']
    destination.price = data['price']
    destination.availability = data['availability']
    destination.discount = data['discount']
    destination.v_type = v_type
    destination.path = data['path']
    destination.best_month = data['best_month']
    db.session.commit()
    return jsonify(destination.serialize())

@app.route('/destinations/<int:destination_id>', methods=['DELETE'])
@token_required(role='admin')
def delete_destination(destination_id):
    destination = Destination.query.get_or_404(destination_id)
    db.session.delete(destination)
    db.session.commit()
    return jsonify({'message': 'Destination deleted successfully'})


@app.route('/reservations', methods=['POST'])
def add_reservation():
    data = request.json
    reservation = Reservation(**data)
    db.session.add(reservation)
    db.session.commit()
    return jsonify({'message': 'Reservation added successfully'}), 201


@app.route('/reservations', methods=['GET'])
def get_all_reservations():
    reservations = Reservation.query.all()
    return jsonify([reservation.serialize() for reservation in reservations])


@app.route('/reservations/destination/<int:destination_id>', methods=['GET'])
def get_reservations_by_destination(destination_id):
    reservations = Reservation.query.filter_by(destination_id=destination_id).all()
    if not reservations:
        return jsonify([])
    return jsonify([reservation.serialize() for reservation in reservations])

if __name__ == '__main__':
    app.run(debug=True)
