# Introduction

In many real-world applications, we often face the challenge of making predictions in a **target domain** where we do not have labeled data. Meanwhile, we may have access to labeled data from several **source domains**, each exhibiting related but potentially different distributions with the target domain of interest. This setting is known as **Multi-Source Unsupervised Domain Adaptation (MSDA)**, as illustrated below.

![Illustration of Multi-source Unsupervised Domain Adaptation](../assets/MSDA.png)

*Figure: Illustration of Multi-source Unsupervised Domain Adaptation. The source domains have labeled data, while the target domain only has unlabeled data.*

The **CGDRO** package is designed for this purpose. It provides tools to build robust prediction models that aim to perform well on the target domain, without access to its labels. Moreover, CGDRO includes built-in tools for **statistical inference**, enabling users to quantify uncertainty and perform hypothesis testing on model parameters.

This package implements methods developed in the following research works:

- **Regression task:** [Guo et al., 2024](#ref-guo2024statistical); [Wang et al., 2023](#ref-wang2023distributionally)  
- **Classification task:** [Guo et al., 2025](#ref-guo2025statistical)


**Highlights:**  
- Solves a **minimax optimization problem** for robust transfer learning.

---

## Formal Setup of MSDA

In the $l$-th **source domain**, where $1 \le l \le L$, we observe labeled samples $\{X_i^{(l)}, Y_i^{(l)}\}_{i=1}^{n_l}$ drawn from a joint distribution  
$\mathbf{P}^{(l)} = (\mathbf{P}_X^{(l)}, \mathbf{P}_{Y|X}^{(l)})$.

Here, $X_i^{(l)} \in \mathbb{R}^d$ are covariates, and $Y_i^{(l)} \in \mathbb{R}$ are corresponding labels.  
In the **target domain**, we observe only covariates $\{X_j^{\mathbf{Q}}\}_{j=1}^N$ drawn from $\mathbf{Q}_X$, while the labels are **unobserved**.

We typically have  
$$N \gg \max_{1 \le l \le L} n_l,$$  
which reflects real-world scenarios where unlabeled data are abundant but labeling is costly.

Two major types of distributional shift may occur simultaneously:

- **Covariate shift:** $\mathbf{Q}_X \ne \mathbf{P}_X^{(l)}$
- **Posterior drift:** $\mathbf{Q}_{Y|X} \ne \mathbf{P}_{Y|X}^{(l)}$

---

## Formulation of the CGDRO Model

To extract transferable knowledge shared across sources and adapt it to the target domain, we propose the **Conditional Group Distributionally Robust Optimization (CGDRO)** model.

While $\mathbf{Q}_X$ is identifiable from observed target covariates, $\mathbf{Q}_{Y|X}$ is not identifiable without labeled data.  
We thus define an *uncertainty class* including all possible mixtures of the source conditional distributions:

$$
\mathcal{C} = \left\{ (\mathbf{Q}_X, \mathbf{T}_{Y|X}) :
\mathbf{T}_{Y|X} = \sum_{l=1}^L q_l \mathbf{P}_{Y|X}^{(l)}, \;
q \in \Delta^L \right\},
$$

where $\Delta^L = \{ q \in \mathbb{R}^L_+ : \sum_{l=1}^L q_l = 1 \}$ is the probability simplex.

We define the **worst-case risk** of model $f_\theta(\cdot)$ as:

$$
\max_{\mathbf{T} \in \mathcal{C}} \mathbb{E}_{(X, Y)\sim \mathbf{T}}
\left[\ell(X, Y; f_\theta)\right].
$$

Then the CGDRO estimator is:

$$
f_{\theta^*} = \arg\min_\theta \max_{\mathbf{T} \in \mathcal{C}}
\mathbb{E}_{(X, Y)\sim \mathbf{T}} \ell(X, Y; f_\theta).
$$

Using the mixture structure, this is equivalently:

$$
f_{\theta^*} = \arg\min_\theta \max_{q \in \Delta^L}
\sum_{l=1}^L q_l \,
\mathbb{E}_{X \sim \mathbf{Q}_X}
\mathbb{E}_{Y \sim \mathbf{P}_{Y|X}^{(l)}}
\ell(X, Y; f_\theta).
$$

---

## Structure of the Package

The **CGDRO** package supports two main prediction tasks:

1. **Regression:** where $Y$ is continuous  
2. **Classification:** where $Y$ is categorical

### Regression

Three types of regression models are provided:

- **Low-dimensional linear model:** $f_{\theta^*}(x) = \theta^{*\top}x$  
- **High-dimensional linear model:** same form but includes regularization and variable selection  
- **Machine learning model:** flexible user-specified learners (e.g., random forests, boosting, neural networks)

### Classification

The current version supports a **linear classifier**  
$f_{\theta^*}(x) = \theta^{*\top}x$.

---

### Python Module Summary

| Python Module | Description | Statistical Inference |
|-----------------------------|---------------------------------|----------------|
| `Regression.linear.ld` | Linear prediction model (low-dimensional) | ✅ |
| `Regression.linear.hd` | High-dimensional linear model | ✅ |
| `Regression.ml` | Machine learning prediction model | ❌ |
| `Classification.linear` | Linear model for classification task | ✅ |

---


## References

<span id="ref-guo2024statistical"></span>
**Guo, Z.** (2024). *Statistical inference for maximin effects: Identifying stable associations across multiple studies.*  
*Journal of the American Statistical Association*, 119(547), 1968–1984.  
[Paper link](https://doi.org/10.1080/01621459.2023.2258469)

<span id="ref-wang2023distributionally"></span>
**Wang, Z.**, **Bühlmann, P.**, & **Guo, Z.** (2023). *Distributionally robust machine learning with multi-source data.*  
*arXiv preprint* [arXiv:2309.02211](https://arxiv.org/abs/2309.02211)

<span id="ref-guo2025statistical"></span>
**Guo, Z.**, **Wang, Z.**, **Hu, Y.**, & **Bach, F.** (2025). *Statistical Inference for Conditional Group Distributionally Robust Optimization with Cross-Entropy Loss.*  
*arXiv preprint* [arXiv:2507.09905](https://arxiv.org/abs/2507.09905)

