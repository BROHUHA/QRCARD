from moviepy import VideoFileClip
import os

input_path = "public/demo.mp4"
output_path = "public/demo.gif"

def convert_to_gif():
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    print(f"Converting {input_path} to {output_path}...")
    try:
        # Load the clip
        clip = VideoFileClip(input_path)
        
        # Write gif
        # Removed program='ffmpeg' as it's likely not needed or causes issues in 2.x
        clip.write_gif(output_path, fps=10) 
        print("Conversion complete.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    convert_to_gif()
