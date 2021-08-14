---
title: 关于Transformer的一切
date: 2021-08-12 00:15:55
permalink: /everything-abort-transformer/
cover: 
tags: 
- 人工智能
- 笔记
- Transformer
categories: 人工智能
---
从关注 Transformer 到学习 Transformer 已经过了很久了，但是一直都是不求甚解，没有非常详细的了解这里面的数学理论和技术实现。现在在这里整理一下关于 Transformer 的疑问。

## 1. Transformer

关于 Transformer 的资源：

1. 看李宏毅老师的介绍，能够很好的了解到基本信息；
2. 看[Illustrated Transformer](http://jalammar.github.io/illustrated-transformer/)；图示更好理解；
3. 看吴恩达的序列视频；
4. 看这个部署与实现[有代码的 Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html)；

![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210812204537-imagepng)

## 2. 关于Transformer的疑问

实在是有太多太多不理解的了！

### self-attention 是怎么处理不同长度的序列信息的

参考知乎的提问：[Transformer是如何处理可变长度数据的？ - 知乎 (zhihu.com)](https://www.zhihu.com/question/445895638)

目前从[[2106.04554] A Survey of Transformers (arxiv.org)](https://arxiv.org/abs/2106.04554)中，邱锡鹏老师认为：

> As a central piece of Transformer, self-attention comes with a flexible mechanism to deal with variable-length inputs. It can be understood as a fully connected layer where the weights are dynamically generated from pairwise relations from inputs.
>
> 作为Transformer的核心部分，self-attention有一个灵活的机制来处理可变长度的输入。它可以被理解为一个全连接层，其权重是由输入的配对关系动态生成的。
>
> ![图片](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20210812203053-imagepng)

不过，我还是不理解，尽管已经有人从数学的角度上做了详细的解释，但是……我不理解啊！

这里是另外一个作者从计算的角度做的解释：[Transformer是如何处理可变长度数据的？ - 许一格的回答 - 知乎](https://www.zhihu.com/question/445895638/answer/1788498350)

> RNN是通过time step的方式处理可变长数据，Transformer是通过计算长度相关的self-attention**得分矩阵**来处理可变长数据。
>
> 首先一个batch内需要padding到同一长度，这个RNN也需要这么做
>
> 然后过完 embedding 层之后假设 tensor 的维度是 $[B, L, D * h]$ ，其中$B$ 是batch size，$L$ 是padding后的seq_len，$D$是 multi-head 里面每一个 head 的维度， $h$ 是head数量
>
> 那么对于每一个head来说，过完线性层之后得到的 $Q,K,V$ 的维度均为$[B, L, D]$，因此 self-attention  的得分矩阵 $Q^{T} K \in \mathbb{R}^{B \times L \times L}$ （除以$\sqrt{D}$与softmax都不影响tensor大小）是一个只与batch size跟seq_len有关的tensor。然后再右乘$V$就相当于一个 $[B,L,L]$ 的tensor与一个$[B,L,D]$在batch维度上做矩阵乘法，得到的tensor维度依然是$[B,L,D]$。后面的FFN一般情况下也不会改变output tensor的维度。
>
> 因此总的来说RNN的输入是 $[B,L,H]$ 输出也是 $[B,L,H]$ ，当 $H=D \times h$ 的时候Transformer输入输出同样是是 $[B,L,H]$ 。当输入长度改变（如变成 $[B,L_1,H]$）的时候self-attention的得分矩阵维度就会变成 $[B,L_1,L_1]$），随后输出的tensor维度就变成$[B,L_1,H]$ 。

这个还是有疑问的，从原始论文中可以看到，$W_{i}^{Q} \in \mathbb{R}^{d_{\text {model }} \times d_{k}}, W_{i}^{K} \in \mathbb{R}^{d_{\text {model } \times d_{k}}}, W_{i}^{V} \in \mathbb{R}^{d_{\text {model }} \times d_{v}}$，Q 和 K 的维度是一样的，而 V 的维度是不一样的，这又是什么情况？

### MultiHeadedAttention 使用的是自注意力？

Multi-Head 用的似乎并不是自注意力机制吧，自注意力机制似乎 Q=K=V，从代码上看，不应该会是自注意力啊。但是这脑子看不懂这个代码啊！

```python
class MultiHeadedAttention(nn.Module):
    def __init__(self, h, d_model, dropout=0.1):
        "Take in model size and number of heads."
        super(MultiHeadedAttention, self).__init__()
        assert d_model % h == 0
        # We assume d_v always equals d_k
        self.d_k = d_model // h
        self.h = h
        self.linears = clones(nn.Linear(d_model, d_model), 4)
        self.attn = None
        self.dropout = nn.Dropout(p=dropout)
  
    def forward(self, query, key, value, mask=None):
        "Implements Figure 2"
        if mask is not None:
            # Same mask applied to all h heads.
            mask = mask.unsqueeze(1)
        nbatches = query.size(0)
  
        # 1) Do all the linear projections in batch from d_model => h x d_k 
        query, key, value = \
            [l(x).view(nbatches, -1, self.h, self.d_k).transpose(1, 2)
             for l, x in zip(self.linears, (query, key, value))]
  
        # 2) Apply attention on all the projected vectors in batch. 
        x, self.attn = attention(query, key, value, mask=mask, 
                                 dropout=self.dropout)
  
        # 3) "Concat" using a view and apply a final linear. 
        x = x.transpose(1, 2).contiguous() \
             .view(nbatches, -1, self.h * self.d_k)
        return self.linears[-1](x)
```

> The Transformer uses multi-head attention in three different ways:
>
> In “encoder-decoder attention” layers, the queries come from the previous decoder layer, and the memory keys and values come from the output of the encoder. This allows every position in the decoder to attend over all positions in the input sequence. This mimics the typical encoder-decoder attention mechanisms in sequence-to-sequence models such as [(cite)](https://arxiv.org/abs/1609.08144).
>
> **The encoder contains self-attention layers.** In a self-attention layer all of the keys, values and queries come from the same place, in this case, the output of the previous layer in the encoder. Each position in the encoder can attend to all positions in the previous layer of the encoder.
>
> Similarly, self-attention layers in the decoder allow each position in the decoder to attend to all positions in the decoder up to and including that position. We need to prevent leftward information flow in the decoder to preserve the auto-regressive property. We implement this inside of scaled dot- product attention by masking out (setting to -∞) all values in the input of the softmax which correspond to illegal connections.

## 3. 关于Transformer的实现

参考[The Annotated Transformer (harvard.edu)](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

### Dropout 具体是怎么做的？

用的多了，但是忘记了是怎么实现的了……
