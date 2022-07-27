#!/bin/bash
ROOT=$PWD
export NODE_ENV=production
echo "Clear dist directory..."
rm -R ./dist
echo "build brainjs lib.."
gulp
echo "build ext lib"
for i in `ls src/ext`; do
echo $i
cd $ROOT/src/ext/$i
gulp
done
