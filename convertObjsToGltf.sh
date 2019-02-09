for filename in ./static/models/*.obj; do
  ./node_modules/obj2gltf/bin/obj2gltf.js -i $filename
done
