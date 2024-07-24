import openai

API_KEY = ''

openai.api_key = API_KEY

def get_chat_completion():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Who won the world series in 2020?"}
            ]
        )
        return response.choices[0].message['content']
    except openai.error.AuthenticationError as e:
        print(f"Error de autenticación: {e}")
    except openai.error.RateLimitError as e:
        print(f"Error de límite de cuota: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    result = get_chat_completion()
    if result:
        print(result)

#tira este error, el mismo del frontend, deberia usar el motor 

##EL EERROR: Error de límite de cuota: You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.