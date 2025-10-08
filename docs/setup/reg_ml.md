# Machine Learning Regression
In this module, we assume that the conditional outcome model in each source domain $1 \le l \le L$ admits any form:

$$
Y^{(l)} = f^{(l)}(X^{(l)}) + \varepsilon^{(l)}, 
\qquad \text{with} \quad \mathbb{E}[\varepsilon^{(l)}|X^{(l)}] = 0,
$$

which implies
$$
\mathbb{E}[Y^{(l)}|X^{(l)}] = f^{(l)}(X^{(l)}) X^{(l)}.
$$

To learn a **robust prediction model** under domain shifts, the CGDRO framework solves the following minimax optimization problem:

$$
f^* = \arg\min_{f \in \mathcal{F}}
\max_{\mathbf{T} \in \mathcal{C}}
\mathbb{E}_{(X, Y) \sim \mathbf{T}} \ell(X, Y; f),

$$

where $\mathcal{C}$ is the **uncertainty class** over possible target distributions, as defined in the [Introduction](../setup/intro.md).

We implement three different loss functions:

- Reward-based loss  
- Squared loss  
- Regret-based loss  

---

## Reward-based Loss

We define the loss as  
$\ell(X,Y;f) = (Y -  f(X))^2 - Y^2$.

Under this choice, the minimax problem becomes

$$
\begin{aligned}
f^*
&= \arg\min_{f \in \mathcal{F}} \max_{\mathbf{T}\in \mathcal{C}}
\mathbb{E}_{\mathbf{T}}\!\left[(Y-f(X))^2 - Y^2\right] \\[2mm]
&= \arg\max_{f \in \mathcal{F}} \min_{\mathbf{T}\in \mathcal{C}}
\mathbb{E}_{\mathbf{T}}\!\left[Y^2 - (Y-f(X))^2\right].
\end{aligned}
$$
The right-hand side shows that  $\mathbb{E}_{\mathbf{T}}\!\left[Y^2 - (Y - f(X))^2\right]$  can be interpreted as the **explained variance** of $Y$ by the predictor $f(X)$ (assuming $Y$ is centered).  
Hence, the CGDRO model maximizes the **worst-case explained variance** across all possible target distributions in $\mathcal{C}$.

---

### Proposition

The CGDRO model $f^*$ with reward-based loss admits the closed form:

$$
f^* = \sum_{l=1}^L q_l^* \, f^{(l)},
\qquad
q^* = \arg\min_{q \in \Delta^L} q^\top \Gamma q,
$$

where $\Gamma \in \mathbb{R}^{L \times L}$ is defined by  

$$
\Gamma_{k,l} =  \mathbb{E}_{\mathbf{Q}}[f^{(k)}(X) f^{(l)}(X)], 
\quad k,l \in [L].
$$

This result implies that $f^*$ is a **convex combination** of the source-specific conditional models $\{f^{(l)}\}$,  
with weights $q^*$ minimizing the second-moment matrix of the target covariates.

---

## Squared Loss


We may also choose the standard squared loss
$\ell(X,Y;f) = (Y - f(X))^2$.

Then the minimax problem becomes

$$
f_{\text{sq}} =
\arg\min_{f} \max_{\mathbf{T} \in \mathcal{C}}
\mathbb{E}_{(X,Y)\sim \mathbf{T}} (Y - f(X))^2.
$$

Define the noise level in each source domain:

$$
(\sigma^{(l)})^2 = \mathbb{E}\!\left[(\varepsilon_i^{(l)})^2 \mid X_i^{(l)}\right],
\qquad
\varepsilon_i^{(l)} = Y_i^{(l)} - f^{(l)}(X_i^{(l)}).
$$

Let $\boldsymbol{\sigma}^2 = ((\sigma^{(1)})^2, \ldots, (\sigma^{(L)})^2)$.

---

### Proposition

The CGDRO model $f_{\text{sq}}$ under squared loss admits the closed form:

$$
f_{\text{sq}} = \sum_{l=1}^L q_l^{\text{sq}} \, f^{(l)},
\qquad
q_{\text{sq}} = \arg\min_{q \in \Delta^L}
q^\top \Gamma q - q^\top (\gamma + \boldsymbol{\sigma}^2),
$$

where $\Gamma \in \mathbb{R}^{L\times L}$ is defined as

$$
\Gamma_{k,l} =  \mathbb{E}_{\mathbf{Q}}[f^{(k)}(X) f^{(l)}(X)], 
\quad k,l \in [L].
$$

and $\gamma \in \mathbb{R}^L$ is the diagonal of $\Gamma$:
$\gamma_l = \Gamma_{l,l}$ for $l \in [L]$.


---

## Regret-based Loss

The **regret** is defined as

$$
\mathrm{Regret}_{\mathbf{T}}(f)
:= \mathbb{E}_{\mathbf{T}}\!\left[(Y-f(X))^2\right]
- \inf_{f'} \mathbb{E}_{\mathbf{T}}\!\left[(Y - f'(X))^2\right].
$$

It measures the **excess risk** of $f$ compared to the optimal model for distribution $\mathbf{T}$.  
The CGDRO formulation then seeks to minimize the **worst-case regret**:

$$
f_{\text{reg}} =
\arg\min_{f \in \mathcal{F}}
\max_{\mathbf{T} \in \mathcal{C}}
\mathrm{Regret}_{\mathbf{T}}(f).
$$

---

### Proposition

The CGDRO model $f_{\text{reg}}$ under regret function admits the closed form:

$$
f_{\text{reg}} = \sum_{l=1}^L q_l^{\text{reg}} \, f^{(l)},
\qquad
q_{\text{reg}} = \arg\min_{q \in \Delta^L}
q^\top \Gamma q - q^\top \gamma,
$$

where $\Gamma \in \mathbb{R}^{L\times L}$ is defined as


$$
\Gamma_{k,l} =  \mathbb{E}_{\mathbf{Q}}[f^{(k)}(X) f^{(l)}(X)], 
\quad k,l \in [L].
$$

and $\gamma \in \mathbb{R}^L$ is the diagonal of $\Gamma$:
$\gamma_l = \Gamma_{l,l}$ for $l \in [L]$.


## Comparison of Losses