import easyocr

reader = easyocr.Reader(['en'])

def extract_text(image_path):
    result = reader.readtext(image_path)

    extracted = []

    for item in result:
        extracted.append(item[1])

    return extracted