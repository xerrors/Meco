---
title: 短文：关于各种标准化的记录（BatchNorm LayerNorm InstanceNorm）
date: 2021-08-06 20:57:22
permalink: /intro-to-three-kands-of-normalization-methods/
cover: 
tags: 
- 深度学习
- 人工智能
- 标准化
categories: 人工智能
---
这个起源于我跟室友的讨论，之前对于这几个标准化的方法都是了解，并不清楚是什么原理，也不知道是怎么计算的、怎么实现的；那么这篇文章就从浅到深介绍一下标准化的方法；kkk

## 1. 什么是标准化/归一化

Normalization，怎么翻译都行，实际上的意思跟数学中的标准化一样，把数据中的每个值减去平均值除以标准差就可以了。可以认为就是这样：

$$
\frac{x-\mu(x)}{\sigma(x)}

$$

既然这么简单还有什么好说的？

---

**2021年8月11日更新**：我还搁这叭叭给人上课呢？还搁这写文章呢？跟室友讨论半天全是错的，真就是菜鸡互啄呀。我写到一半感觉有些记不清了，打算搜一搜看看公式什么样？结果一搜：

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210811201957-Snipaste_20210811_201928png)

然后就本着试一试的态度点开了，迎面来了一张图，颠覆了我的认知：

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210811202134.png)

好家伙，原来我之前理解的都是错的！

总结如下：

* BatchNorm：batch方向做归一化，计算NxHxW的均值
* LayerNorm：channel方向做归一化，计算CxHxW的均值
* InstanceNorm：一个channel内做归一化，计算HxW的均值
* GroupNorm：先将channel方向分group，然后每个group内做归一化，计算(C//G)xHxW的均值
* GN与LN和IN有关，这两种标准化方法在**训练循环（RNN / LSTM）或生成（GAN）模型**方面特别成功

## 参考资料

[1] [深度学习之17——归一化(BN+LN+IN+GN) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/74476637)

[2] [深度学习中的五种归一化（BN、LN、IN、GN和SN）方法简介_修行之路-CSDN博客_gn是什么意思](https://blog.csdn.net/u013289254/article/details/99690730)
