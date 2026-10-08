import struct, base64
def parse_wav(b):
    assert b[:4]==b"RIFF" and b[8:12]==b"WAVE"
    p=12; fmt=None; info={}; data=None; others=[]
    while p+8<=len(b):
        cid=b[p:p+4]; ln=struct.unpack("<I",b[p+4:p+8])[0]; body=b[p+8:p+8+ln]
        if cid==b"fmt ": fmt=struct.unpack("<HHIIHH",body[:16])
        elif cid==b"data": data=body
        elif cid==b"LIST" and body[:4]==b"INFO":
            q=4
            while q+8<=len(body):
                sid=body[q:q+4].decode("latin1"); sl=struct.unpack("<I",body[q+4:q+8])[0]
                info[sid]=body[q+8:q+8+sl].rstrip(b"\0").decode("utf-8","replace"); q+=8+sl+(sl&1)
        else: others.append(cid.decode("latin1"))
        p+=8+ln+(ln&1)
    return {"fmt":fmt,"info":info,"data":data,"others":others}
