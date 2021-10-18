npm run build
mkdir -p ./dist/lang
mkdir -p ./dist/styles
cp ./lang/* ./dist/lang/
cp ./styles/* ./dist/styles/
cp module.json ./dist/module.json