import gradio as gr
from gtts import gTTS
import re
from pydub import AudioSegment
from langchain.llms import OpenAI
import os
from contants import secret_key
from utils import *

# Function to convert text to speech



def text_to_speech(topic):
    input_test = "I want you to give me content for a podcast for the topic "+ topic+" I do not want any opening music or segments. I just want the transcript of the conversation. The anchors are Lily and Margot. Give me 100 lines in total."
    os.environ['OPENAI_API_KEY'] = secret_key
    llm = OpenAI(temperature = 0.8)
    output = llm(input_test)
    # Parse the dialogue and generate audio
    dialogue = parse_dialogue(output)
    generate_audio(dialogue)

    # Combine audio files with opening music
    combine_audio_with_music(dialogue)
    
    output_path = os.path.join("combined_podcast.mp3")  # Define the file path
    return output_path  # Return the file path for Gradio to play

# Create Gradio interface
interface = gr.Interface(
    fn=text_to_speech,  # Function to call
    inputs=gr.Textbox(label="Enter Topic", placeholder="Type anything you wanna know about"),  # Text input
    outputs=gr.Audio(label="Podcast"),  # Audio output
    title="PodGenie: AI-Driven Podcast Creator",  # Title
)

# Launch the interface
interface.launch()