import struct, subprocess, hashlib, tempfile, os
FF=["ffmpeg","-hide_banner","-loglevel","error","-y","-nostdin"]
TAGMAP=[("INAM","TITLE"),("IART","ARTIST"),("ICOP","COPYRIGHT"),("ICMT","COMMENT"),("ISFT","ENCODED-BY"),("IGNR","GENRE")]
VENDOR=b"audionaut-library-build"

def ffmpeg_flac(pcm_bytes, extra, tmpdir):
    """pcm_bytes: raw s16le mono 44.1k. Returns the FLAC file bytes ffmpeg produced."""
    out=tempfile.mktemp(suffix=".flac",dir=tmpdir)
    try:
        subprocess.run(FF+["-f","s16le","-ar","44100","-ac","1","-i","-","-map_metadata","-1","-c:a","flac",
                           "-flags","+bitexact","-fflags","+bitexact"]+extra+[out],input=pcm_bytes,check=True,capture_output=True)
        return open(out,"rb").read()
    finally:
        if os.path.exists(out): os.remove(out)

def split_flac(b):
    assert b[:4]==b"fLaC"
    pos=4; blocks=[]
    while True:
        h=b[pos]; t=h&0x7f; ln=int.from_bytes(b[pos+1:pos+4],"big")
        blocks.append((t,b[pos+4:pos+4+ln])); pos+=4+ln
        if h&0x80: break
    return blocks, b[pos:]

def vorbis_block(tags):
    body=struct.pack("<I",len(VENDOR))+VENDOR+struct.pack("<I",len(tags))
    for k,v in tags:
        kv=(k+"="+v).encode("utf-8"); body+=struct.pack("<I",len(kv))+kv
    return body

def finalize(flac_bytes, pcm_bytes, info):
    """Strip padding/extra blocks, write MD5 into STREAMINFO, attach licence tags as VORBIS_COMMENT."""
    blocks, frames = split_flac(flac_bytes)
    si=[body for t,body in blocks if t==0][0]
    md5=hashlib.md5(pcm_bytes).digest()
    si=si[:18]+md5
    tags=[(vk,info[ik]) for ik,vk in TAGMAP if ik in info]
    vc=vorbis_block(tags)
    out=b"fLaC"
    out+=bytes([0])+len(si).to_bytes(3,"big")+si
    out+=bytes([0x80|4])+len(vc).to_bytes(3,"big")+vc
    return out+frames
