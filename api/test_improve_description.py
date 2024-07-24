import requests

url = 'http://localhost:5000/improve-description'

description_to_improve = "Esta es una descripción de proyecto que necesita ser mejorada."

data = {
    'description': description_to_improve
}

headers = {
    'Content-Type': 'application/json'
}

response = requests.post(url, json=data, headers=headers)

if response.status_code == 200:
    improved_description = response.json().get('improved_description', '')
    print('Descripción mejorada:', improved_description)
else:
    print('Error al procesar la solicitud:', response.status_code, response.text)
