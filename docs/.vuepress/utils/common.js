// 测试功能暂时先这样
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export function getRandomCover() {
  const covers = [
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207164933.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165125.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165254.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165322.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165403.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165503.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207165603.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207170646.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207170947.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171249.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171320.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171341.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171408.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171426.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171450.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171733.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171919.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171939.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207171949.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172002.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172026.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172049.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172119.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172135.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172209.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172224.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172236.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172305.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172341.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172403.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172413.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172425.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172450.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172502.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172528.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172544.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172559.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172609.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172620.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172637.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172647.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172656.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172723.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172735.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172745.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172754.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172805.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172815.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172826.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172837.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172849.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172905.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172918.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172935.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172949.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207172958.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173006.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173016.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173028.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173038.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173101.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173109.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173118.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173128.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173141.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173152.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210207173201.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210412220553.png",
    "https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210412220808.png",
  ]

  const ind = getRandomInt(0, covers.length);
  return covers[ind];
}
export function getQueryVariable(variable){
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
          let pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return(false);
}