---
title: Neural Audio Spring Reverb
description: Audio plugin and research paper for DAFx 2024
date: 2024-09-01
featuredimage: /assets/img/neutone-square.webp
featuredimagepreview: /assets/img/neutone-square.webp
categories:
  - research
---
Neural Audio Spring Reverb is a differentiable model of analog springs designed for the Neutone plugin platform and presented at DAFx 2024. The project combines circuit-inspired DSP with deep learning to capture the chaotic behaviour of hardware tanks while remaining lightweight enough for real-time performance.

{{< image
    src="/assets/img/neutone.webp"
    alt="Neural Audio Spring Reverb plugin UI"
    caption="Neural Audio Spring Reverb running inside Neutone."
>}}

The toolkit includes:

- PyTorch training scripts and datasets built from impulse responses of multiple spring tanks.
- A Neutone-compatible VST/AU plugin with macro controls for modulation, color, and excitation modes.
- Evaluation notebooks comparing the neural model with physically modelled and convolutional baselines.

Explore the full toolkit, research notes, and downloadable plugin builds on GitHub.

{{< github-card repo="francescopapaleo/neural-audio-spring-reverb" description="AI-assisted spring reverb modeling project presented at DAFx 2024, including VST builds, training scripts, and evaluation notebooks." cta="Open repository" >}}
