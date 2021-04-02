---
title: 什么是 Numpy 的广播？
date: 2020-02-29 21:03:13
permalink: /boardcast-in-numpy 
tags: 
 - Python
 - Numpy
categories: Python
---

Numpy 的广播机制

参考[scipy](https://docs.scipy.org/doc/numpy/user/basics.broadcasting.html)

## 什么是广播

Numpy 的两个数组或数组与其他数据进行算数运算的时候会调整数组的形状以适应运算，是 Numpy 的广播机制。

例如：

```python
>>> a = np.array([1.0, 2.0, 3.0])
>>> b = 2.0
>>> a * b
array([ 2.,  4.,  6.])
```

由于 Numpy 在进行运算的时候并没有进行实际上的内存拷贝（可以理解为并没有真正修改另外一个数组），所以进行广播运算的时候会节省内存。

## 广播的规则

Numpy会比较进行运算的两个数组，从最低维度开始向前比较，维度相兼容的条件是：

1. 他们是相同的
2. 他们其中一个是 1

否则就会引起广播错误。运算后的结果数组的形状是参与运算的数组中每个维度的最大值。当然也可以不具备一样多的维度。

```
A      (4d array):  8 x 1 x 6 x 1
B      (3d array):      7 x 1 x 5
Result (4d array):  8 x 7 x 6 x 5

A      (2d array):  5 x 4
B      (1d array):      1
Result (2d array):  5 x 4

A      (2d array):  5 x 4
B      (1d array):      4
Result (2d array):  5 x 4

A      (3d array):  15 x 3 x 5
B      (3d array):  15 x 1 x 5
Result (3d array):  15 x 3 x 5

A      (3d array):  15 x 3 x 5
B      (2d array):       3 x 5
Result (3d array):  15 x 3 x 5

A      (3d array):  15 x 3 x 5
B      (2d array):       3 x 1
Result (3d array):  15 x 3 x 5
```

下面这些数组没法进行广播：

```
A      (1d array):  3
B      (1d array):  4 # trailing dimensions do not match

A      (2d array):      2 x 1
B      (3d array):  8 x 4 x 3 # second from last dimensions mismatched
```

更多示例参考文档：[Scipy](https://docs.scipy.org/doc/numpy/user/basics.broadcasting.html)
