import { gsap } from 'gsap'

export default function getStarts({ children, direction, spacing, width }) {
    const viewport = window.innerWidth;
    const remaining = width - viewport; // text minus width of viewport
    const start = direction === 1 ? viewport : -width; // the start depending on direction
    let starts = [];
    starts[0] = direction === 1 ? 0 : -remaining;
    gsap.set(children[0], { x: starts[0] });
    gsap.set(children[1], { x: starts[0] });
    for (let i = 1; i < children.length / 2; i++) {
        if (direction === 1) {
            if (starts[i - 1] + width + spacing < viewport) {
                starts[i] = starts[i - 1] + width + spacing;
            } else {
                starts[i] = start;
            }
        } else if (direction === -1) {
            if (starts[i - 1] - spacing > 0) {
                starts[i] = starts[i - 1] - width - spacing;
            } else {
                starts[i] = start;
            }
        }

        // set position to the current starting position
        gsap.set(children[i * 2], { x: starts[i] });
        gsap.set(children[i * 2 + 1], { x: starts[i] });
    }
    return starts;
}