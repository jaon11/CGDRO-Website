# Introduction

CGDRO solves the following robust optimization problem:

$$
f_{\theta^*}
= \arg\min_{\theta} \ \max_{\mathbf{T} \in \mathcal{C}}
\ \mathbb{E}_{(X, Y)\sim \mathbf{T}} \ \ell(X, Y; f_\theta),
$$

where $\mathcal{C}$ represents a family of plausible target distributions.  
The solution $f_{\theta^*}(\cdot)$ guards against distributional shifts by minimizing the worst-case prediction risk over $\mathcal{C}$.

---

## **Highlights**

1. Efficiently and provably solve the minimax problem for the robust model $f_{\theta^*}$.
2. Quantify the uncertainty of the learned model with rigorous statistical guarantees.

---

## **Structure of the Package**

The package supports two main prediction tasks:

- **Regression** (continuous outcome)
- **Classification** (discrete outcome)

### **Regression Models**

- **Low-dimensional linear:**  
  $f_{\theta^*}(x) = (\theta^*)^\top x$ with moderate feature dimension

- **High-dimensional linear:**  
  $f_{\theta^*}(x) = (\theta^*)^\top x$ with built-in regularization and variable selection

- **Flexible ML model:**  
  A user-specified model $f_{\theta^*}(x)$ using ML tools  
  (random forests, boosting, neural networks)

### **Classification Models**

- A generalized linear model for classification.

---

## **Python Modules in CGDRO**

<p align="center"><font size="2"></font></p>

<div class="center" markdown>

| Python Module           | Description                           | Statistical Inference |
|:-----------------------:|:-------------------------------------:|:---------------------:|
| `Regression.linear.ld`  | linear prediction model (lowd)        | ✓                     |
| `Regression.linear.hd`  | high-dimensional linear model (highd) | ✓                     |
| `Regression.ml`         | machine learning prediction model     | ✗                     |
| `Classification`        | linear model for classification       | ✓                     |

</div>


---

## **References**

Depending on the prediction task, CGDRO implements methods from:

- **Regression:** [Guo et al. (2024)](#ref-guo2024statistical); [Wang et al. (2023)](#ref-wang2023distributionally)  
- **Classification:** [Guo et al. (2025)](#ref-guo2025statistical)



We now introduce the CGDRO framework.  
More details can be found in **[CGDRO-Regression](../method/cgdro-reg.md)** and **[CGDRO-Classification](../method/cgdro-cls.md)**.


---

## **CGDRO: Leveraging Multiple Labeled Sources**

Suppose we have $L$ labeled source domains.  
In the $l$-th source domain ($1 \le l \le L$),

$$
(X^{(l)}, Y^{(l)})
\sim
\mathbf{P}^{(l)} := (\mathbf{P}^{(l)}_X, \mathbf{P}^{(l)}_{Y|X}).
$$

For the target domain, we write:

$$
(X^\mathrm{Q}, \textcolor{blue}{Y^\mathrm{Q}})
\sim
\mathrm{Q} := (\mathrm{Q}_X, \textcolor{blue}{\mathrm{Q}_{Y|X}}),
$$

where only $X^\mathrm{Q}$ is observed, but the target labels $\textcolor{blue}{Y^\mathrm{Q}}$ are entirely missing.

While $\mathrm{Q}_X$ is identifiable from observed target covariates, the conditional distribution $\textcolor{blue}{\mathrm{Q}_{Y|X}}$ is not, since no target labels are observed.
Rather than making assumptions about the form of $\textcolor{blue}{Y^\mathrm{Q}}$, CGDRO defines an uncertainty class that includes possible mixtures of the source conditional distributions:

$$
\mathcal{C} := \left\{ (\mathrm{Q}_X, \mathbf{T}_{Y|X}) : \mathbf{T}_{Y|X} = \sum_{l=1}^L q_l \cdot \mathbf{P}^{(l)}_{Y|X}, \; \text{with}\; q \in \Delta^L \right\},
$$

where $\Delta^L$ denotes the $(L-1)$-dimensional simplex, i.e., $\gamma_l \ge 0$ and $\sum_{l=1}^L \gamma_l = 1$.
This class $\mathcal{C}$ contains the true target distribution $(\mathrm{Q}_X, \textcolor{blue}{\mathrm{Q}_{Y|X}})$ if $\textcolor{blue}{\mathrm{Q}_{Y|X}}$ admits a mixture representation of the source conditional distributions.

In practice, one may have certain priors about the source mixture for the target domain. For instance, domain experts may believe that the target's conditional distribution $\textcolor{blue}{\mathrm{Q}_{Y|X}}$ resembles a mixture of the sources $\{\mathbf{P}^{(l)}_{Y|X}\}_{l}$.

To encode this, restrict the mixture weights to a local neighborhood:

$$
\mathcal{H}
= \{ q \in \Delta^L : \|q - q_{\rm prior}\|_2 \le \rho \},
$$

where $\rho$ controls the trust region size.

The prior-informed uncertainty class becomes:

$$
\mathcal{C}_{\mathcal{H}}
=
\left\{
(\mathrm{Q}_X, \mathbf{T}_{Y|X}):
\mathbf{T}_{Y|X}
= \sum_{l=1}^L q_l \mathbf{P}^{(l)}_{Y|X},
\ q \in \mathcal{H}
\right\}.
$$

The corresponding model is:

$$
f_{\theta_{\mathcal{H}}^*}
=
\arg\min_{\theta}
\ \max_{\mathbf{T}\in \mathcal{C}_{\mathcal{H}}}
\ \mathbb{E}_{(X, Y)\sim \mathbf{T}}
\ \ell(X, Y; f_\theta).
$$

Incorporating prior information often leads to **less conservative** solutions and **better predictive performance** when the prior is accurate.




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

