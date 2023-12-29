import { gsap } from 'gsap'

export default function animateNames({
    // PROPS
    children,
    duration,
    direction,
    spacing,
    width,
    starts
}) {

    const viewport = window.innerWidth;
    const start = direction === 1 ? viewport : -width;
    const end = direction === 1 ? -width : viewport; // find end point
    const distance = width + viewport; // distance needed to travel
    const overflow = width * (children.length / 2 - 1) - viewport; // overflow distance of children and viewport
    const repeatWait = (overflow / distance) * duration; // the delay time between repeating
    const spacingDuration = (spacing / distance) * duration; // duration that takes into account spacing
    const tl = gsap.timeline(); // reference to timeline

    // if there isn't more than 1 child
    if (children.length < 4) {
        return;
    }

    // initial for loop (for all the elements before the last one)
    for (let i = 0; i < children.length / 2 - 1; i++) {
        // calculate initial duration
        const initDuration = (Math.abs(end - starts[i]) / distance) * duration;

        // animation
        tl.to(
            // select the current iteration items
            [children[i * 2], children[i * 2 + 1]],
            {
                x: end, // animate to end
                ease: 'none', // no ease for linear animation
                duration: initDuration, // use initial duration

                // ON COMPLETE: set the selected elements to the starting position
                onComplete: function () {
                    gsap.set([children[i * 2], children[i * 2 + 1]], {
                        x: start
                    });
                }
            },
            '<' // start at beginning of previous animation
        );
    }

    // last element animation (starts offscreen)
    tl.to(
        [children[children.length - 2], children[children.length - 1]],
        {
            x: end,
            ease: 'none',
            duration: duration,
            repeat: -1, // repeat infinitely

            // calculatethe proper repeat delay including the spacing
            repeatDelay: repeatWait + (children.length / 2) * spacingDuration
        },
        '<' + (repeatWait + (children.length / 2 - 1) * spacingDuration) // start after previous animation plus delay and spacing delay
    );

    for (let j = 0; j < children.length / 2 - 1; j++) {
        tl.to(
            [children[j * 2], children[j * 2 + 1]],
            {
                x: end,
                ease: 'none',
                duration: duration,
                repeat: -1,
                repeatDelay: repeatWait + (children.length / 2) * spacingDuration
            },
            '<' + ((width / distance) * duration + spacingDuration)
        );
    }

    return tl;
}