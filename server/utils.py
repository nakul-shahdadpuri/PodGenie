import gradio as gr
from gtts import gTTS
import re
from pydub import AudioSegment
from langchain.llms import OpenAI
import os
from contants import secret_key


def parse_dialogue(output):
    dialogue = []
    lines = output.strip().split("\n\n")
    for line in lines:
        match = re.match(r"(\w+): (.+)", line.strip())
        if match:
            speaker, text = match.groups()
            dialogue.append((speaker, text))
    return dialogue

# Generate audio files for each line with different voices
def generate_audio(dialogue, output_folder="output"):
    os.makedirs(output_folder, exist_ok=True)
    for i, (speaker, text) in enumerate(dialogue):
        # Determine the appropriate `tld` for the speaker
        tld = "com" if speaker == "Lily" else "com.au"  # Example: 'com' for US accent, 'com.au' for Australian accent
        tts = gTTS(text=text, lang="en", tld=tld, slow=False)
        output_path = os.path.join(output_folder, f"{i + 1}_{speaker}.mp3")
        tts.save(output_path)
        print(f"Saved: {output_path}")

    print("\nAll audio files generated successfully!")

# Combine audio with opening music
def combine_audio_with_music(dialogue,output_folder="output", opening_music_file="opening_music.mp3", combined_file="combined_podcast.mp3"):
    combined = AudioSegment.empty()

    # Add opening music
    try:
        opening_music = AudioSegment.from_file(opening_music_file)
        combined += opening_music
        print("Added opening music.")
    except FileNotFoundError:
        print(f"Opening music file '{opening_music_file}' not found. Skipping opening music.")

    # Add dialogue audio
    for i, (speaker, _) in enumerate(dialogue):
        file_path = os.path.join(output_folder, f"{i + 1}_{speaker}.mp3")
        audio = AudioSegment.from_file(file_path)
        combined += audio

    # Export combined audio
    combined.export(combined_file, format="mp3")
    print(f"Combined audio saved as: {combined_file}")
