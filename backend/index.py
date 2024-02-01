from flask import Flask, jsonify, request
import requests
from textblob import TextBlob
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
base_url = "https://en.wikipedia.org/w/api.php"
@app.route('/', methods=['POST'])
def get_tags():
    try:
       
        # Get the request JSON data
        #data = request.get_json()
        inputdata = request.data.decode('UTF-8').split("!!!")

        # Check if the "user_id" key exists in the JSON data
        #text = data['text']
        text=inputdata[1]
        blob = TextBlob(text)
        nouns = list(set(blob.noun_phrases)-set(inputdata[0]))
        print("nouns",nouns)
        output = {}
        
        for noun in nouns:
            print(noun)
            params = {
            'action': 'query',
            'format': 'json',
            'list': 'search',
            'srsearch': noun,
             'srlimit': 1,
            }

            # Make the API request
            response = requests.get(url=base_url, params=params)
            
            # Check if the request was successful (HTTP status code 200)
            if response.status_code == 200:
                data = response.json()
                search_results = data['query']['search']
        
                if search_results:
                    # Get the title of the most relevant result
                    most_relevant_result = search_results[0]
                    most_relevant_title = most_relevant_result['title']
                    print("most relevant title:",most_relevant_title)
                    print(inputdata[0])
         
                    if "\""+most_relevant_title!=inputdata[0]:
                    
                        # Get the introductory paragraph of the most relevant article
                        intro_paragraph,link = get_intro_paragraph_and_link(most_relevant_title)
                        if len(intro_paragraph)>200:
                            intro_paragraph=intro_paragraph[:200]+"..."
                        print(intro_paragraph,link)
                        output[most_relevant_title] = [intro_paragraph,link]
            else:
                return f"Error: Unable to fetch data. Status code {response.status_code}"
        return jsonify(output)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
def get_intro_paragraph_and_link(title):
    base_url = "https://en.wikipedia.org/w/api.php"
    
    # Specify the parameters for the API request to get the page content
    params = {
        'action': 'query',
        'format': 'json',
        'titles': title,
        'prop': 'extracts|info',
        "inprop":"url",
        'exintro': True,  # Get only the introductory section of the article
        'explaintext': True
    }

    # Make the API request to get the page content
    response = requests.get(url=base_url, params=params)
    
    # Check if the request was successful (HTTP status code 200)
    if response.status_code == 200:
        data = response.json()
        # Extract the page content from the response
        page = next(iter(data['query']['pages'].values()))
        if 'missing' not in page and "fullurl" in page:
            return page['extract'], page["fullurl"]
        else:
            print("page not found")
            return f"Article '{title}' not found."
    else:
        return f"Error: Unable to fetch data. Status code {response.status_code}"




if __name__ == '__main__':
    app.run(debug=True)
