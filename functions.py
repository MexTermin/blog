def validateImg(name):
    allow_images = set(["png","jpeg","jpg","gif","web"])
    return "." in name and name.rsplit(".", 1)[1] in allow_images
