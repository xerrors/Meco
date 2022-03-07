---
title: KnowPrompt 论文笔记记录
date: 2021-12-18 13:33:44
permalink: /know-prompt/
cover: 
tags: 
- Prompt
- 人工智能
categories: 人工智能
---

# KnowPrompt: Knowledge-aware Prompt-tuning with Synergistic Optimization for Relation Extraction

作者: Xiang.Chen
可用链接: https://arxiv.org/abs/2104.07650, https://www.connectedpapers.com/main/3624cbbe08f6bc7979e7403d2b32b70816f810f1/KnowPrompt%3A-Knowledge%20aware-Prompt%20tuning-with-Synergistic-Optimization-for-Relation-Extraction/graph, https://github.com/zjunlp/KnowPrompt
年份: 2021
日期: December 18, 2021 11:24 AM
状态: 略读
论文标签: Prompt, RE

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220307133634.png)

最近，prompt-tuning 在某些少见的分类任务中取得了可喜的成果。prompt-tuning 的核心思想是在输入中插入文本片段（即模板），并将分类任务转化为一个掩码的语言建模问题（masked language modeling problem）。然而，对于关系提取来说，确定一个合适的提示模板需要领域的专业知识，而且要获得一个合适的标签词是很麻烦和耗时的。**此外，实体和关系之间存在着丰富的语义知识（关系标签中存在丰富的语义和先验知识），不能被忽视。**为此，我们专注于将知识纳入关系提取的prompt-tuning 中，并提出了一种具有**协同优化功能**的**知识感知** prompt-tuning 调整方法（KnowPrompt）。具体来说，我们将实体和关系知识注入到具有可学习的虚拟模板词以及答案词的 prompt 构建中，并通过知识约束来协同优化它们的表述。在五个标准和低资源设置的数据集上的广泛实验结果证明了我们方法的有效性。https://github.com/zjunlp/KnowPrompt

![图1：通过将特定任务格式化为完形填空任务来刺激PLM知识的即时调优示例。虚球中的P和C代表语义完形的虚词Person和Country。](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220307133606.png)

图1：通过将特定任务格式化为完形填空任务来刺激PLM知识的即时调优示例。虚球中的P和C代表语义完形的虚词Person和Country。

![图2：论文中描述的答案词是指我们提出的虚拟答案词。](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220307133602.png)

图2：论文中描述的答案词是指我们提出的虚拟答案词。

### 简单记录：

目前的知识提取的方法不行（PLMs + classifier）their performance heavily depends on time-consuming and labor-intensive annotated data, making it hard to generalize well.

现在有个叫 Prompt-Tuning 的方法还不错；In a nutshell, prompt-tuning involves template engineering and verbalizer engineering, which aims to search for the best template and an answer space.

但是想用在知识提取上面还有几个问题，**首先**，手动构建费时费力（determining the appropriate prompt template for RE requires domain expertise），自动构建计算开销太大（auto-constructing a high-performing prompt with input entities often requires additional computation cost for generation and verification）。**其次**，想从输出空间中得到目标标签难度太大（搜索空间复杂度、特定标签不存在）the computational complexity of the label word search process is very high when the length of the relation label varies, and it is non-trivial to obtain a suitable target label word in the vocabulary to represent the specific relation label. **另外**，关系标签中、三元组之间都有关联的知识（关系标签中语义、三元组结构等）In addition, there exists rich semantic knowledge among relation labels and structural knowledge implications among relational triples, which cannot be ignored.

所以，作者就将知识注入到可学习的 prompts 中并提出新的知识感知协同优化 Prompt-tunning（KnowPrompt）

第二章，简述发展历程，关系提取过渡了CNN/RNN时代、基于图的方法、预训练模型作为主干、知识增强的预训练语言模型等；然后顺便提了一嘴 few-shot 的内容。

之后介绍Prompt-tuning的内容，被GPT-3推动诞生，然后在RE领域有人提出了[**PTR**](https://arxiv.org/abs/2105.11259)(**Prompt Tuning with Rules for Text Classification**)，也不知道是啥，就说自己的几点不一样。

1. **首先提出用虚拟答案词来表示特定的关系标签**，而不是PTR中的多个sub-prompt。本质上，我们的方法是模型不可知的，可以应用于生成式语言模型，而PTR由于其sub-prompt机制而失败。
2. **其次虚拟词都是可学习的**，减少劳动力且更加灵活可推广。Secondly, we construct prompt with knowledge injection via learnable virtual type words and virtual answer words to alleviate labor-intensive prompt engineering rather than predefined rules; thus, our method is more flexible and can generalize to different RE datasets easily.
3. **第三给输出添加了知识约束和关联**。Thirdly, we synergistically optimize virtual type words and answer words with knowledge constraints and associate prompt embeddings with each other.

第三章补充了prompt-tuning的背景知识，可以借助此图理解[[Pre-train, prompt, and predict: A systematic survey of prompting methods in natural language processing](https://www.notion.so/Pre-train-prompt-and-predict-A-systematic-survey-of-prompting-methods-in-natural-language-process-299045f92e424f64ab7ccd1397b790a3) ]

**知识注入**

分为实体知识注入和关系知识注入；

![表1：数据集示例](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220307133502.png)

表1：数据集示例

**实体知识注入**：实体的类型标签有用但是数据集中不一定会有，但是可以通过特定关系中包含的先验知识来获得**潜在的实体类型的范围**（However, we can obtain the scope of the potential entity types with prior knowledge contained in a specific relation, rather than annotation.）。可以根据关系类名来估计潜在实体类型的候选集的先验分布（Intuitively, we estimate the prior distributions $\phi_{sub}$ and $\phi_{obj}$ over the candidate set $C_{sub}$ and $C_{obj}$ of potential entity types, respectively, according to the relation class, where the prior distributions are estimated by frequency statistics.）。所以知识注入过程可以公式化为[公式1](https://www.notion.so/KnowPrompt-Knowledge-aware-Prompt-tuning-with-Synergistic-Optimization-for-Relation-Extraction-ab64d0b0c7cf46c49923b118266b59e0)。$I$ 表示去重操作，$\mathbf{e}$ 表示PLM的word-embedding。这就得到了实体的 Typer Marker，具体的使用方法类似于[图2](https://www.notion.so/KnowPrompt-Knowledge-aware-Prompt-tuning-with-Synergistic-Optimization-for-Relation-Extraction-ab64d0b0c7cf46c49923b118266b59e0)中的绿色部分。

$$
\begin{equation}\hat{\mathbf{e}}_{[s u b]}=\sum \phi_{s u b} \cdot \mathbf{e}\left(I\left(\mathbf{C}_{s u b}\right)\right)\end{equation}

$$

**关系知识的注入**：以往是自动生成词汇表中的标签词和一个任务标签之间的一一映射，搜索计算复杂度大且没有用到关系的语义知识。这里的 $\mathbf{e}$ 表示 PLM 的 HEAD Layer 的一个额外的可学习关系嵌入层。作者提议对有关标签的语义知识进行编码并促进 RE 的过程（We propose to encodes semantic knowledge about the label and facilitates the process of RE）。

$$
\begin{equation}\hat{\mathbf{e}}_{[r e l]}\left(v^{\prime}\right)=\phi_{r} \cdot \mathbf{e}\left(\mathbf{C}_{r}\right)\end{equation}

$$

```python
word_embeddings = self.model.get_input_embeddings() # A torch module mapping vocabulary to hidden states. Embedding(50300, 1024)
# IDs are assigned here
continous_label_word = [a[0] for a in self.tokenizer([f"[class{i}]" for i in range(1, num_labels+1)], add_special_tokens=False)['input_ids']]

# init_answer_words:
for i, idx in enumerate(label_word_idx): # idx: e.g. tensor([265, 138, 18727, 0, 0, 0])
    word_embeddings.weight[continous_label_word[i]] = torch.mean(word_embeddings.weight[idx], dim=0) # mean

# init type words
so_word = [a[0] for a in self.tokenizer(["[obj]","[sub]"], add_special_tokens=False)['input_ids']] # e.g. [50294, 50293]
meaning_word = [a[0] for a in self.tokenizer(
				["person","organization", "location", "date", "country"], add_special_tokens=False)['input_ids']] # e.g. [5970, 17247, 41829, 10672, 12659]

for i, idx in enumerate(so_word):
    word_embeddings.weight[so_word[i]] = torch.mean(word_embeddings.weight[meaning_word], dim=0) # mean, sub = obj
```

**协同优化**

由于实体类型和关系标签之间存在密切的交互和联系，并且这些虚拟类型词（virtual type words）以及答案词（virtual answer words）都应该与周围的上下文相关联，因此我们进一步引入了一种对虚拟类型参数集（$\hat{\mathbf{e}}_{[s u b]},\hat{\mathbf{e}}_{[obj]}, \hat{\mathbf{e}}_{[rel]}(V^{'})$）具有隐式结构约束的协同优化 virtual type words and virtual answer words.

第一个约束，上下文感知 Prompt 校准（Context-aware Prompt Calibration）。基于自然语言初始化的向量表达并不一定是最优的，所以需要通过上下文进一步校准他们的表示（Although our virtual type and answer words are initialized based on knowledge, they may not be optimal in the latent variable space. They should be associated with the surrounding context. Thus, further optimization is necessary by perceiving the context to calibrate their representation.）$p(y \mid x)=p\left([\text { MASK }]=\mathcal{V}^{\prime} \mid x_{\text {prompt }}\right)$ 通过减少这个损失来修正（？）

$$
\begin{equation}\mathcal{J}_{[\text {MASK }]}=-\frac{1}{|\mathcal{X}|} \sum_{x \in \mathcal{X}} \mathrm{y} \log p(y \mid x)\end{equation}

$$

第二个约束，隐式结构约束（Implicit Structured Constraints）（即代码中的KE-Loss）。$(s,r,o)$ 分别表示（virtual types of subject, virtual types of object, relation label）他们的词嵌入都是直接将 virtual type words and virtual answer words 的输出来计算的，结构损失如公式所示，等式的后半部分是负例样本（$(s_i^{'}, r, o_i^{'})$ are negative samples,  $\gamma$  is the margin, $\sigma$ refers to the sigmoid function and $d_r$ is the scoring function.）

$$
\begin{equation}
\begin{aligned}
&\mathcal{J}_{\text {structured }}=-\log \sigma\left(\gamma-d_{r}(\mathrm{~s}, \mathbf{o})\right) 
-\sum_{i=1}^{n} \frac{1}{n} \log \sigma\left(d_{r}\left(\mathrm{~s}_{\mathbf{i}}^{\prime}, \mathbf{o}_{\mathbf{i}}^{\prime}\right)-\gamma\right)
\end{aligned}
\end{equation}

$$

$$
\begin{equation}d_{r}(\mathbf{s}, \mathbf{o})=\|\mathbf{s}+\mathbf{r}-\mathbf{o}\|_{2}\end{equation}

$$

### 实验结果以及结论：

![Untitled](https://xerrors.oss-cn-shanghai.aliyuncs.com/imgs/20220307133445.png)

<aside>
💡 结论：In this paper, we present KnowPrompt for relation extraction, which mainly includes knowledge-aware prompt construction and synergistic optimization with knowledge constraints. In the future, we plan to explore two directions, including: (i) extending to semi-supervised setting to further leverage unlabeled data; (ii) extending to lifelong learning, whereas prompt should be optimized with adaptive tasks. （本文提出了一种基于知识感知的关系抽取方法KnowPrompt，主要包括知识感知的提示符构造和基于知识约束的synergistic 优化。未来，我们计划探索两个方向，包括:(i)扩展到半监督设置，进一步利用无标签数据;(2)扩展到终身学习，而提示应通过适应性任务优化。）
</aside>
