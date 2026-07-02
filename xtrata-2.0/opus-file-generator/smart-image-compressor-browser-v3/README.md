# Smart Image Compressor - Browser Edition v3

This version avoids macOS/Homebrew Tkinter issues and runs as a local browser app.

New in v3:

- uploaded image list
- original image canvas preview
- compressed canvas preview
- side-by-side comparison
- size, format and resolution comparison
- preview uses the same settings as the final zip export
- no dependency on `tkinter` or `tkinterdnd2`
- multipart parsing no longer depends on Python's old `cgi` module

## Install

```bash
python3 -m pip install -r requirements.txt
```

## Run

```bash
python3 web_image_compressor.py
```

The app opens locally in your browser at something like:

```text
http://127.0.0.1:8765/
```

Drag images or folders into the page. Select an image in the list to compare original vs compressed.

## Mac shortcut

```bash
./run_mac.command
```

If needed:

```bash
chmod +x run_mac.command
```

## Recommended settings

Everyday use:

```text
Balance: Balanced
Output format: Auto best
Max long edge: Original size
Skip if output is larger: On
```

Website images:

```text
Balance: Balanced
Output format: Auto best
Max long edge: 2048 px or 1600 px
Skip if output is larger: On
```

Smallest files:

```text
Balance: Smallest
Output format: Auto best
Max long edge: 1600 px or lower
```

## Optional iPhone HEIC / HEIF support

```bash
python3 -m pip install pillow-heif
```

## Notes

The browser page is only talking to the local Python process on your machine. Files are not uploaded to the internet.
