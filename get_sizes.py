from PIL import Image
files=['media/zal.webp','media/Dmitry.webp','media/Alexandra.webp','media/Chausov.webp']
for f in files:
    try:
        with Image.open(f) as img:
            print(f, img.size)
    except Exception as e:
        print('error',f,e)
