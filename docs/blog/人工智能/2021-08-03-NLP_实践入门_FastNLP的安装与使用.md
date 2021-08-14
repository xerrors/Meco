---
title: NLP 实践入门（FastNLP的安装与使用）
date: 2021-08-03 16:30:02
permalink: /nlp-practice-for-beginner/
cover: 
tags: 
- 人工智能
- 算法
- NLP
categories: 人工智能
---
看了几天的论文，眼睛都要看瞎掉了；总是朦朦胧胧不知道这些作者都在说一些什么。因为之前并没有接触过 NLP 的任务，所以对这里面的数据处理、评估标准、损失计算以及整个计算的流程都不是很熟悉。听取师兄的建议，先把这个 fastNLP 了解一下，最起码这个工具还是比较完备的，可以让我快速的了解整个 NLP 任务的大体流程；那就开始学习吧！！！

## 1. FastNLP

GitHub 地址：[fastnlp/fastNLP](https://github.com/fastnlp/fastNLP)

### 安装

这部分直接看[官方文档](https://fastnlp.readthedocs.io/zh/latest/user/installation.html)问题不大，不过需要注意的是：

1. 提前安装好对应版本的 pytorch
2. 网络正常（如果出现问题参考[这里](https://blog.csdn.net/weixin_43818488/article/details/105756408)的解决办法，也就是把 [en](https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.0.0/en_core_web_sm-3.0.0.tar.gz) 下载下来之后，`pip install <文件名>`)

参考：[PyTorch 历史版本下载页面](https://download.pytorch.org/whl/torch_stable.html)

### 使用

> 【可略过的】抱怨：每次导入一个数据集或者一个小模型都需要联网下载，这个可折磨我很久了，每个月学校的校园网就那么500m，一会儿儿就没了。

### 遇到的问题

#### 问题1：RuntimeError: 'lengths' argument should be a 1D CPU int64 tensor, but got 1D cuda:1 Long tensor

PyTorch 的版本问题：[fastNLP/issues#349](https://github.com/fastnlp/fastNLP/issues/349)

解决办法：安装新版本的 fastNLP hhhhh

```sh
pip uninstall fastNLP
pip install git+https://gitee.com/fastnlp/fastNLP@dev
```

#### 问题2：更新 cuda 与 cudnn

现在又遇到另外一个问题，现在的 cuda 的版本实在是太低了，但是因为这个服务器是很多人一起使用的，我不敢随意更新版本，更何况我也不是 root 用户，也没有更新的权限，所以有没有什么办法可以更新一下自己账户下的 cuda 的版本。

安装之前需要先明确几个信息：

1. 当前系统以及版本（如 Ubuntu 16.04）
2. 当前 NVIDIA 驱动版本（使用 nvidia-smi 查看）

确定之后对照一下这个表来确认最大支持安装哪个版本。

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210804124905-image.png)

1. 下载预期版本的 cuda 和 cudnn

进入这个[历史版本](https://developer.nvidia.com/cuda-toolkit-archive)页面，以 10.1 版本举例，之后选择对应的版本下载 runfile(local) 版本。有的时候下面会有一个下载的按钮，有的时候没有，没有的话，就把指令里面的地址复制到浏览器里面下载。或者直接在服务器使用命令行直接下载，介于服务器只连接到了教育网，并没有连接到公网，所以我选择现在自己电脑上面下载，只有再 scp 到服务器上面。

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210804125518-image.png)

同样是需要到[这里](https://developer.nvidia.com/rdp/cudnn-archive)下载所需要的对应的 cudnn 版本。

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210804131547-image.png)

2. 安装 cuda 和 cudnn

这部分直接参考 [这篇文章](https://zhuanlan.zhihu.com/p/198161777)就很好，不过需要注意的一点就是最后修改 `.bashrc` 的时候，应该是这样修改：

```sh
export CUDA_HOME=$CUDA_HOME:/home/name/cuda-10.1
export PATH=/home/name/cuda-10.1/bin:$PATH     # 这一行有变动
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/name/cuda-10.1/lib64
```

参考：[知乎](https://zhuanlan.zhihu.com/p/198161777)

#### 问题3：torch.cuda.is_available() 为 False，但是 torch.backends.cudnn.enabled 为 True

这时候一般是 PyTorch 和 cuda 的版本不一致的问题，要仔细看看了，注意，cuda 的版本应该使用 `nvcc -V` 来查看，`nvidia-smi` 的版本不可靠。

#### 问题4：python 多层结构目录之间包的引用问题

就比如

```
Task
├── pkg1
│ ├── __init__.py
│ ├── level2.py
└── scripts
  └── a.py
```

这里 `a.py` 想要使用 `from pkg1 import level2`，就会报错，可以参考这里[Python-import导入上级目录文件](https://zhuanlan.zhihu.com/p/64893308)，不过总而言之，难搞！

## 2. NLP 任务中的知识点

### train/dev/test

之前在做实验的时候只知道 train/test/val，这三个我很多时候也分的不是很清楚，现在出现了一个 dev 更加摸不到头脑了。

形象化的来说，如果把模型的训练作为考试，把模型比作学生；那么训练数据就是平时的练习题（train set），反复做这些练习题来提升学生（模型）的能力（准确度）；

但是学生（模型）学的好不好，或者哪些学生学的比较好，就需要使用模拟卷来测试，通过模拟卷（dev set）选拔出来一个学的最好的出来，去参加正式的考试，不管之前在学校考的怎么样，之后最后正式的考试（test set）结果才能代表学生（模型）的真正实力。

数据量较少的时候使用 7:2:1 的比例来分割 train/dev/test。当数据量比较大的时候，dev set 和 test set 应该足够大，100-10000个比较合适。

关于为什么需要 dev 数据集，[这篇文章](https://snji-khjuria.medium.com/everything-you-need-to-know-about-train-dev-test-split-what-how-and-why-6ca17ea6f35)做了详细的介绍如下。

在建立从数据中学习的模型的过程中，我们需要从所有其他可用的模型中找出模型的最佳参数和最佳模型。如果我们没有 dev 数据集，那么我们将使用训练集训练所有的模型，并选择在训练数据上性能最好的模型。通过使用 dev 数据集，我们在一个单一的过程中做出了两个选择。

- Parameter choice 参数选择
- Model choice 模型选择

首先通过训练算法选择最优参数，然后利用这些参数对 dev 数据进行处理，帮助我们找到最优的模型结构，而不是通过学习算法本身做出的选择。

PS：看到最后才发现这篇文章的参考资料就是吴恩达的课程视频，看来是我没有好好看视频，我的错 :-(

参考：[Everything You Need To Know About Train/Dev/Test Split — What, How and Why](https://snji-khjuria.medium.com/everything-you-need-to-know-about-train-dev-test-split-what-how-and-why-6ca17ea6f35)
