
cd `dirname $0`

# 暂时存在bug

git add $1

git commit -am "auto commit by MS" || echo "Git is Clean"

cd -