---
title: DETR End-to-End Object Detection with Transformers 论文解读
date: 2021-10-31 09:37:11
permalink: /detr-into/
cover: https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306094847.png
tags: 
- 目标检测
- Transformer
categories: 人工智能
---
## 1. DETR: End-to-End Object Detection with Transformers

会议/期刊: ECCV
作者: Francisco.Massa, Nicolas.Carion
可用链接: https://arxiv.org/abs/2005.12872, https://arxiv.org/pdf/2005.12872.pdf, https://www.ecva.net/papers/eccv_2020/papers_ECCV/papers/123460205.pdf

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306094028.png)

<aside>
💡 我们提出了一种新的方法，将目标检测看作一个直接集合预测问题。我们的方法简化了检测流水线，有效地消除了对许多手工设计组件的需要，如非最大抑制过程（NMS）或锚生成，这些组件显式地编码了我们关于任务的先验知识。新框架的主要组成部分被称为 DEtection TRansformer 或 DETR，它是一个基于集合的全局损失，通过二部匹配强制进行唯一的预测，以及一个 Transformer 编码器-解码器架构。给定一个固定的少量学习对象查询集，DETR 推理对象与全局图像上下文的关系，直接并行输出最终的预测集。与许多其他现代探测器不同，新型号的探测器概念简单，不需要专门的库。在极具挑战性的 COCO 物体检测数据集上，DETR 证明了精确度和运行时性能与成熟的、高度优化的 Faster RCNN 基准不相上下。此外，DETR 可以很容易地推广到以统一的方式产生全景分割。我们表明，它的表现远远超过了竞争基线。
</aside>

## 2. 介绍

目标检测的目标是为每个感兴趣的目标预测一组边界框和类别标签。现代检测器通过在一大组 proposals(Faster R-CNN)、anchors(YOLO)、或 windows centers(CenterNet) 上定义代理回归（surrogate regression）和分类问题（classification problems），以间接方式解决该集合预测任务。它们的性能受到折叠近似重复预测（collapse near-duplicate predictions）的后处理步骤、锚点集合的设计以及将目标框分配给锚点的启发式算法的显著影响。为了简化这些流水线，我们提出了一种绕过代理任务的直接集合预测方法。这种端到端的哲学已经在机器翻译或语音识别等复杂的结构化预测任务中取得了重大进展，但在目标检测方面还没有取得重大进展：以前的尝试要么添加了其他形式的先验知识，要么在具有挑战性的基准方面证明不能与强大的 baseline 竞争。本文旨在弥合这一鸿沟。

我们通过将对象检测视为直接集合预测问题来简化训练流水线。我们采用基于 Transformer 的编解码器架构，这是一种流行的序列预测架构。Transformer 的自注意机制显式地模拟序列中元素之间的所有成对相互作用，使得这些体系结构特别适用于集合预测的特定约束，例如删除重复预测。

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306093834.png)

我们的 DETR 一次预测所有对象，并使用集合损失函数进行端到端训练，该函数在预测对象和真实对象之间执行二分匹配（bipartite matching）。DETR 通过丢弃多个手工设计的组件来简化检测流程，如空间锚点或非最大抑制等组件编码先验知识。与大多数现有的检测方法不同，DETR不需要任何定制的层，因此可以很容易地在任何包含标准CNN和变压器类的框架中复制。

与以往的大多数直接集预测工作相比，DETR的主要特点是将二分图匹配损失（bipartite matching loss）和 Transformer 与（non-autoregressive）并行解码结合在一起。相比之下，以前的工作主要集中在用RNN进行自回归解码（autoregressive decoding）。我们的匹配损失函数将预测唯一地分配给地面真实对象，并且不随预测对象的排列而变化，因此我们可以并行地预测。

我们在最流行的目标检测数据集COCO上与非常有竞争力的更快的R-CNN基线进行了DETR评估。更快的 RCNN 经历了多次设计迭代，自最初出版以来，其性能得到了极大的改善。我们的实验表明，我们的新模型取得了与之相当的性能。更准确地说，DETR在大型对象上表现出明显更好的性能，这一结果可能是由 Transformer 的非本地计算实现的。然而，它在小物体上获得的性能较低。我们预计，未来的工作将改善这一方面，就像FPN的开发对更快的R-CNN所做的那样。

DETR的训练设置在许多方面与标准对象检测器不同。新模型需要超长的训练时间，并受益于Transformer 中的辅助解码损失（auxiliary decoding losses）。我们将深入探讨哪些组件对性能至关重要。

DETR的设计理念很容易扩展到更复杂的任务。在我们的实验中，我们表明，在预先训练的DETR上训练的简单分割头部优于基于全视分割的竞争性基线，这是一项具有挑战性的像素级识别任务，最近变得流行起来。

## 3. 相关工作

1. bipartite matching losses for set prediction
2. encoder-decoder architectures based on the transformer
3. parallel decoding
4. object detection methods

### 集合预测：Set Prediction

目前还没有标准的深度学习模型来直接预测集合。基本集合预测任务是多标签分类，对于该多标签分类，一对一(one-vs-rest)基线方法不适用于诸如在元素之间存在底层结构(即，接近相同的框)的检测等问题。这些任务的第一个困难是避免近乎重复的工作。目前的大多数检测器都使用非最大值抑制等后处理来解决这个问题，但是直接集预测是不需要后处理的。他们需要全局推理方案来对所有预测元素之间的交互进行建模，以避免冗余。对于固定大小的集合预测，密集的全连接网络（FCN）是足够的，但成本很高。一般的方法是使用自回归序列模型，如递归神经网络[48]。在所有情况下，损失函数都应该通过预测的排列保持不变。通常的解决方案是在匈牙利算法[20]的基础上设计一个损失，在地面事实和预测之间找到一个二分匹配。这强制了排列不变性，并保证每个目标元素都有唯一的匹配项。我们遵循二部匹配损失的方法。然而，与大多数以前的工作不同的是，我们放弃了自回归模型，而使用了具有并行解码的转换器，下面我们将对此进行描述。

### 并行编码：Transformers and Parallel Decoding

Transformers 是由Vaswaniet等人提出的。作为一种新的基于注意力的机器翻译构建块。注意力机制是从整个输入序列中聚合信息的神经网络层。Transformers 引入了自注意力层，类似于非局部神经网络，它扫描序列的每个元素，并通过聚合整个序列的信息来更新它。基于注意力的模型的主要优点之一是它的全局计算和完美的记忆，这使得它们比RNN更适合长序列。在自然语言处理、语音处理和计算机视觉的许多问题上，Transformers 现在正在取代RNN。

Transformers 首先用在自回归模型中，在早期的 seq2seq 模型之后，一个接一个地产生输出 tokens。然而，令人望而却步的推理成本(与输出长度成正比，很难批量处理)导致了并行序列生成在音频、机器翻译、单词表示学习以及最近的语音识别领域的发展。我们还结合了Transformers and Parallel Decoding，以便在计算成本和执行集合预测所需的全局计算能力之间进行适当的折衷。

### 目标检测：Object detection

大多数现代目标检测方法相对于某些初始猜测进行预测。两级检测器（Two-stage detectors）预测盒子（predict boxes），也就是提案（proposals），而单阶段（single-stage）方法作出预测，也就是锚（anchors）或可能的对象中心（object centers）的网格。最近的工作[52]表明，这些系统的最终性能在很大程度上取决于这些初始猜测的确切设置方式。在我们的模型中，我们能够消除这种手工制作的过程，并通过使用绝对盒子预测的直接预测检测集来简化检测过程，也就是输入图像而不是锚点。

基于集合的损失。几个目标检测器使用了二部匹配损失。然而，在这些早期的深度学习模型中，不同预测之间的关系只用卷积或完全连通的层来建模，而手工设计的NMS后处理可以提高它们的性能。较新的检测器与NMS一起使用地面事实和预测之间的非唯一分配规则。

可学习的NMS方法和关系网络显式地建模具有注意力的不同预测之间的关系。使用直接集合损失（direct set losses），它们不需要任何后处理步骤。然而，这些方法使用其他手工制作的上下文特征（如proposal box coordinates）来高效地建模检测之间的关系，同时我们寻找减少模型中编码的先验知识的解决方案。

与我们的方法最接近的是目标检测的端到端集合预测和实例分割（instance segmentation）。与我们类似，他们使用基于CNN激活的编码器-解码器架构的二分匹配损耗来直接产生一组边界框（bounding boxes）。然而，这些方法只在较小的数据集上进行了评估，而没有针对现代基线进行评估。具体地说，它们基于自回归模型（更准确地说是RNNs），因此它们不会利用最新的并行解码转换器。

## 4. DETR 模型

对于检测中的直接集合预测，有两个要素是必不可少的：(1)集合预测损失，其强制在预测和真值框之间进行唯一匹配；(2)(在 single pass 中)预测一组对象并对其关系进行建模的体系结构。我们在图2中详细描述了我们的体系结构。

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306093844.png)

### 目标检测集合预测损失：Object detection set prediction loss

DETR在一次通过解码器的过程中推断出一组固定大小的 N 个预测，其中 N 被设置为明显大于图像中对象的典型数量。训练的主要困难之一是根据真实情况对预测对象(类、位置、大小)进行评分。我们的损失在预测对象和真实对象之间产生最佳的二部匹配，然后优化特定对象(边界框)损失。

让我们用 $y$ 表示对象的地面真实集合，并且 $\hat{y}=\left\{\hat{y}_{i}\right\}_{i=1}^{N}$ 表示N个预测的集合。假设 N 大于图像中对象的数量，我们也将 $y$ 视为一组大小为 N 的填充了∅(无对象)的集合。为了找到这两个集合之间的二部匹配，我们搜索具有**最低成本**的N个元素 $\empty \in \mathfrak{S}_N$ 的排列：

$$
\hat{\sigma}=\underset{\sigma \in \mathfrak{G}_{N}}{\arg \min } \sum_{i}^{N} \mathcal{L}_{\operatorname{match}}\left(y_{i}, \hat{y}_{\sigma(i)}\right)

$$

其中 $\mathcal{L}_{\operatorname{match}}(y_{i}, \hat{y}_{\sigma(i)})$ 是地面真实数据 $y_i$ 与指标为 $\sigma (i)$ 的预测之间的成对匹配成本。根据先前的工作，用匈牙利算法有效地计算了这种最优分配。*译注：匈牙利算法可以很好的解决最有匹配、配对问题；*

匹配代价既考虑了类别预测，也考虑了预测真值框和真实真值框的相似性。真实真值集的每个元素 $i$可以被视为 $y_i=(c_i，b_i)$，其中，$c_i$ 是目标类别标签(可以是∅)，$b_{i} \in[0,1]^{4}$ 是定义地面真值框中心坐标及其相对于图像大小的高度和宽度的向量。对于指标为 $\sigma (i)$ 的预测，我们定义类 $c_i$ 的概率为 $\hat{p}_{\sigma(i)}\left(c_{i}\right)$，预测框为 $\hat{b}_{\sigma(i)}$。利用这些记号，我们将 $\mathcal{L}_{\operatorname{match}}(y_{i}, \hat{y}_{\sigma(i)})$ 定义为 $-\mathbb{1}_{\left\{c_{i} \neq \varnothing\right\}} \hat{p}_{\sigma(i)}\left(c_{i}\right)+\mathbb{1}_{\left\{c_{i} \neq \varnothing\right\}} \mathcal{L}_{\text {box }}(b_{i}, \hat{b}_{\sigma(i)})$。

该寻找匹配的过程与用于将 proposal 或 anchors 匹配到现代检测器中的真实对象的启发式分配规则起到相同的作用。主要区别在于，我们需要找到一对一的匹配来进行直接集合预测，而不需要重复。

第二步是计算损失函数，即上一步匹配的所有配对的匈牙利损失。我们对损失的定义类似于常见对象检测器的损失，即用于类别预测的负对数似然性和稍后定义的 box loss 的线性组合：

$$
\mathcal{L}_{\text {Hungarian }}(y, \hat{y})=\sum_{i=1}^{N}\left[-\log \hat{p}_{\hat{\sigma}(i)}\left(c_{i}\right)+\mathbb{1}_{\left\{c_{i} \neq \varnothing\right\}} \mathcal{L}_{\text {box }}\left(b_{i}, \hat{b}_{\hat{\sigma}}(i)\right)\right]

$$

其中 σ 是在第一步(1)中计算的最优分配。在实践中，当 $c_i= \empty$ 时，我们将对数概率项的权重降低10倍，以说明类别不平衡。这类似于 R-CNN 训练程序如何通过二次抽样来更快地平衡 正例/负例 proposals。请注意，对象和 ∅ 之间的匹配成本不依赖于预测，这意味着在这种情况下成本是恒定的。在匹配代价中，我们使用概率 $\hat{p}_{\hat{\sigma}(i)}\left(c_{i}\right)$ 代替对数概率。这使得类预测项可以与 $\mathcal{L}_{\text {box }}(\cdot, \cdot)$ (如下所述)可以同单位度量，并且我们观察到了更好的经验表现。

**边界框损失**：匹配成本和匈牙利损失的第二部分是为边界框评分的 $\mathcal{L}_{\text {box }}(\cdot, \cdot)$ 。与许多探测器不同的是，它们以一些“初始猜测”的形式进行边框预测，我们直接进行盒子预测。虽然这种方法简化了实施，但也带来了损失相对扩大的问题。最常用的 “$\ell_{1}$损失” 对于小盒子和大盒子具有不同的刻度，即使它们的相对误差相似。为了缓解这个问题，我们使用了尺度不变的 “$\ell_{1}$损失“ 和 IoU 损失 $\mathcal{L}_{\text {iou}}(\cdot, \cdot)$ 的线性组合。总体而言，我们的盒子损失是 $\mathcal{L}_{\text {box }}(b_{i}, \hat{b}_{\sigma(i)})$，定义为$\lambda_{\text {iou }} \mathcal{L}_{\text {iou }}(b_{i}, \hat{b}_{\sigma(i)})+\lambda_{\mathrm{L} 1}|| b_{i}-\hat{b}_{\sigma(i)} \|_{1}$其中$\lambda_{\mathrm{iou}}, \lambda_{\mathrm{L} 1} \in \mathbb{R}$ 是超参数。这两个损失由 batch 内的对象数量归一化。

## 5. DETR 的结构

总体DETR架构出人意料地简单，如图2所示。它包括三个主要部分，我们将在下面描述：提取紧凑特征表示的CNN主干，编解码器转换器，以及做出最终检测预测的简单前馈网络(FFN)。与许多现代检测器不同，DETR可以在任何深度学习框架中实现，只要提供通用的CNN主干和只有几百行的 transformer 体系结构实现。在 PyTorch 中，DETR的推理代码可以用少于50行的代码来实现。我们希望我们的方法的简单性将吸引新的研究人员进入检测界。

**Backbone**：输入一张初始图像 $x_{img} \in \mathbb{R}^{3 \times H_0 \times W_0}$，使用一个传统的 CNN 主干网络生成一个低分辨率的激活映射 $f \in \mathbb{R}^{C \times H \times W}$，这里的 $C= 2048$，$H，W = \frac{H_0}{32}, \frac{W_0}{32}$。

DETR使用传统的CNN主干来学习输入图像的2D表示。该模型将其展平，并在将其传递到 transformer 编码器之前用位置编码对其进行补充。然后，transformer 解码器将少量固定数量的学习位置嵌入作为输入，我们对这些位置嵌入进行查询，并额外处理编码器输出。我们将解码器的每个输出嵌入传递到一个共享前馈网络(FFN)，该网络预测一个检测(类和边界框)或一个“no object”类。

![](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306093853.png)

DETR使用传统的CNN主干来学习输入图像的2D表示。该模型将其展平，并在将其传递到 transformer 编码器之前用位置编码对其进行补充。然后，transformer 解码器将少量固定数量的学习位置嵌入作为输入，我们对这些位置嵌入进行查询，并额外处理编码器输出。我们将解码器的每个输出嵌入传递到一个共享前馈网络(FFN)，该网络预测一个检测(类和边界框)或一个“no object”类。

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306093913.png)

**编码器**：首先使用 1x1 的卷积将高级激活映射图的通道数 C 降低到更低的维度 d，产生一个新的特征图 $z_0 \in \mathbb{R}^{d \times H \times W }$，由于编码器需要序列数据作为输入，因此我们把 $z_0$ 的空间维度压缩到一个维度变成 $d \times HW$维度的特征图。每个编码层都是由一个多头自注意力模块和一个前馈神经网络（FFN）组成的标准结构，因为 transformer 是具备排列不变性的（前后顺序无关），所以我们在每个注意力层的输入上加了一个固定的位置编码，我们根据补充材料对体系结构的详细定义进行了说明，该定义遵循《Attention is all you need》中所述的定义。*注：降维、flatten、位置编码*

**解码器**：解码器是遵循 transformer 的标准结构，使用多头自注意力机制和编码解码注意力机制将 N 个维度为 d 的嵌入编码。与原版解码器的不同是我们的模型在每一个解码层并行的解码 N 个对象，而原版使用一个自回归模型来一次预测输出序列的一个元素。由于解码器也是排列不变的，因此 N 个输入嵌入必须不同才能产生不同的结果。这里的输入嵌入式可学习的位置编码，我们称之为$object \space queries$，类似于编码器，自后将他们加到每个注意力层的输入。解码器将N个对象查询转换为嵌入的输出。然后，它们被前馈网络(在下一小节中描述)独立地解码成盒子坐标和类别标签，从而得到N个最终预测。利用对这些嵌入编码的自注意力和编解码器注意力，该模型使用所有对象之间的成对关系来全局推理所有对象，同时能够将整个图像作为上下文。

**前馈神经网络**：最终的预测由一个具有RELU激活函数和隐维数的三层感知器和一个线性投影层来计算。FFN 预测归一化中心坐标、输入图像中长方体的高度和宽度，并且线性层使用Softmax函数预测类别标签。由于我们预测了一组固定大小的N个边界框，其中N通常比图像中感兴趣的对象的实际数量大得多，所以使用附加的特殊类别标签∅来表示在插槽内没有检测到对象。在标准的目标检测方法中，这个类扮演着类似于“background”类的角色。

**辅助解码损失**：在训练过程中，我们发现在解码器中使用辅助损失是很有帮助的，特别是帮助模型输出正确的每类对象数量。我们在每一解码器层之后添加预测FFN和匈牙利损失。所有预测FFN共享它们的参数。我们使用一个额外的共享的 layer-norm 来归一化来自不同解码层的预测FFN的输入。

<aside>
💡 训练细节见原论文
</aside>

## 6. 名词解释

[目标检测中的AP，mAP](https://zhuanlan.zhihu.com/p/88896868)

AP(Average Precision)：顾名思义AP就是平均精准度，简单来说就是对PR曲线上的Precision值求均值。对于pr曲线来说，我们使用积分来进行计算。

$$
A P=\int_{0}^{1} p(r) d r

$$

![Untitled 5](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306094113.png)

## 7. 实验结果以及结论：

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220306093926.png)

<aside>
💡 提出了一种新的基于 Transformer 和双边匹配损失的直接集合预测目标检测系统设计方案--DETR。该方法在具有挑战性的 COCO 数据集上获得了与优化的更快的R-CNN baseline 相当的结果。DETR易于实现，并且具有灵活的体系结构，可轻松扩展到全景分割，并获得具有竞争力的结果。此外，与速度更快的R-CNN相比，它在大型物体上的性能要好得多，这可能要归功于自注意对全局信息的处理。这种探测器的新设计也带来了新的挑战，特别是在训练、优化和小物体性能方面。目前的探测器需要几年的改进才能处理类似的问题，我们预计未来的工作将成功地解决DETR的这些问题。
</aside>

由于采用的 Transformer 的结构，众所周知 Transformer 的时空开销是 $O(L^2)$，详细查看 [A Survey of Transformers](https://www.notion.so/A-Survey-of-Transformers-7a9ce6191e6948569177af01d4b142e0)，所以没法在 decoder 输入太多的特征，所以也没办法针对小物体优化。所以 $AP_S$ 效果稍微差一点。
