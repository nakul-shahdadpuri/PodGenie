from flask import Flask, request, Response
import time

app = Flask(__name__)

def generate_stream(data):
    for char in data:
        yield char
        time.sleep(0.1)  # Simulate streaming delay

@app.route('/stream', methods=['POST'])
def stream():
    if not request.is_json:
        return {"error": "Request must be JSON"}, 400

    input_data = request.json.get('input', '')
    if not isinstance(input_data, str):
        return {"error": "Input must be a string"}, 400

    return Response(generate_stream(input_data), content_type='text/plain')

if __name__ == '__main__':
    app.run(debug=True)