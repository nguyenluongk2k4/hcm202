const fs = require('fs');
let css = fs.readFileSync('src/components/minigames/PolishGem.css', 'utf8');
const finaleIndex = css.indexOf('.ethics-finale {');
if (finaleIndex !== -1) {
  css = css.substring(0, finaleIndex);
}
const newCss = `
.ethics-stage {
  transition: all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.ethics-stage.is-collapsing {
  transform: scale(0.5) translateY(100px) rotateX(20deg);
  opacity: 0;
  filter: blur(10px) brightness(2);
  pointer-events: none;
}

.ethics-finale {
  position: fixed;
  inset: 0;
  z-index: 180;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.epic-bamboo-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.1) translateY(40px);
  animation: bambooReveal 3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes bambooReveal {
  0% { opacity: 0; transform: scale(1.1) translateY(40px); filter: brightness(1); }
  30% { opacity: 1; transform: scale(1.02) translateY(5px); filter: brightness(1.5) drop-shadow(0 0 40px rgba(16, 185, 129, 0.6)); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: brightness(1); }
}

.epic-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.4) 40%, transparent 100%);
}

.ethics-message-card {
  position: relative;
  z-index: 32;
  display: grid;
  width: min(86vw, 44rem);
  gap: 0.8rem;
  justify-items: center;
  padding: clamp(1.2rem, 3vw, 2rem);
  border: 1px solid rgba(167, 243, 208, 0.52);
  border-radius: 12px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02)),
    rgba(6, 78, 59, 0.4);
  box-shadow:
    0 1rem 3.2rem rgba(0, 0, 0, 0.5),
    0 0 3rem rgba(16, 185, 129, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  text-align: center;
  backdrop-filter: blur(16px);
  opacity: 0;
  transform: translateY(30px);
  transition: all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  margin-top: 20vh;
}

.ethics-message-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.ethics-message-card small {
  color: #a7f3d0;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.ethics-message-card h3 {
  margin: 0;
  color: #ffffff;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0.02em;
  text-shadow:
    0 0 1rem rgba(167, 243, 208, 0.5),
    0 0 2rem rgba(254, 240, 138, 0.3);
}

.ethics-message-card strong {
  color: #fef9c3;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  font-weight: 800;
  line-height: 1.4;
  max-width: 38rem;
}

.ethics-message-card p {
  margin: 0;
  color: rgba(236, 253, 245, 0.9);
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  font-weight: 500;
  line-height: 1.6;
  max-width: 40rem;
}
`;
fs.writeFileSync('src/components/minigames/PolishGem.css', css + newCss);
