import sys, glob
from PIL import Image
item = sys.argv[1]; per = int(sys.argv[2]) if len(sys.argv) > 2 else 6; w = int(sys.argv[3]) if len(sys.argv) > 3 else 700; tag = sys.argv[4] if len(sys.argv) > 4 else ''
fs = sorted(glob.glob(f'/home/claude/dog-army/checks/screens/shot-{item}{tag}-*.png'), key=lambda f: int(f.rsplit('-', 1)[1][:-4]))
ims = [Image.open(f) for f in fs]; ims = [im.resize((w, int(im.height * w / im.width))) for im in ims]
cols = 2 if w >= 600 else 4; h = ims[0].height
for j in range(0, len(ims), per):
    sub = ims[j:j + per]; rows = (len(sub) + cols - 1) // cols; W = Image.new('RGB', (w * cols, h * rows))
    for i, im in enumerate(sub): W.paste(im, ((i % cols) * w, (i // cols) * h))
    W.save(f'/tmp/sheet-{item}{tag}-{j // per}.png'); print(f'/tmp/sheet-{item}{tag}-{j // per}.png')
