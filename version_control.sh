
cd `dirname $0`

# 暂时存在bug

git add $1

if [[ -n $(git diff --cached) ]]
then 
    git commit -m "auto commit by MS"
else
    echo ""
    echo "Git is Clean!"
    echo ""
fi